'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Calendar, CreditCard, Clock, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AxiosInstance from '../../lib/axiosInstance'

interface PlanFeature {
    featureId: string
    name: string
    value: boolean | number | string
}

interface Plan {
    id: string
    name: string
    price: number
    interval: number
    features: PlanFeature[]
}

interface SubscriptionStatus {
    isActive: boolean
    type: number
    endDate: Date
    startDate: Date
}

export function PremiumPlans() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await AxiosInstance.get('/api/users/subscriptionPlans')
                setPlans(response.data.data)
            } catch (error) {
                console.error('Error fetching plans:', error)
            }
        }

        const checkSubscription = async () => {
            try {
                const response = await AxiosInstance.get('/api/users/subscription-status')
                setSubscriptionStatus(response.data.data)
            } catch (error) {
                console.error('Error checking subscription status:', error)
            }
        }

        fetchPlans()
        checkSubscription()
    }, [])

    const formatInterval = (interval: number) => {
        if (interval === 1) return { period: 'month', label: 'Monthly' }
        if (interval === 12) return { period: 'year', label: 'Yearly' }
        return { period: `${interval} months`, label: `${interval}-Month` }
    }

    const calculateMonthlyPrice = (price: number, interval: number) => {
        return (price / interval).toFixed(2)
    }

    const handleSubscribe = async (plan: Plan) => {
        try {
            setIsLoading(plan.id)
            router.push(`/user/checkout?planId=${plan.id}`)
        } catch (error) {
            console.error('Error initiating subscription:', error)
        } finally {
            setIsLoading(null)
        }
    }

    if (subscriptionStatus?.isActive) {
        const activePlan = plans.find(plan => plan.interval === subscriptionStatus.type)

        return (
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Your Premium Subscription</h1>

                <div className="max-w-3xl mx-auto">
                    <Card className="mb-8 border-2 border-primary/20">
                        <CardHeader className="bg-primary/5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <Shield className="h-6 w-6 text-primary" />
                                        {activePlan?.name}
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-lg">
                                        ₹{activePlan?.price.toFixed(2)} / {formatInterval(activePlan?.interval || 1).period}
                                    </CardDescription>
                                </div>
                                <div className="px-4 py-2 bg-primary/10 rounded-full">
                                    <span className="text-sm font-medium text-primary">Active Plan</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium">Start Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(subscriptionStatus.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm font-medium">Renewal Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(subscriptionStatus.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">Your Premium Features</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activePlan?.features.map((feature) => (
                                        <div key={feature.featureId}
                                            className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors">
                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span className="text-sm">
                                                {feature.name} {typeof feature.value === 'boolean' ? '' :
                                                    <span className="font-medium text-primary">({feature.value})</span>}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-center mb-4">Choose Your Premium Plan</h1>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                Select the plan that best suits your needs. All plans include our core premium features.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {plans.sort((a, b) => a.interval - b.interval).map((plan) => (
                    <Card key={plan.id}
                        className="flex flex-col hover:border-primary/50 transition-colors duration-300">
                        <CardHeader className="text-center pb-4 space-y-2">
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <div className="flex flex-col items-center">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">₹{plan.price.toFixed(2)}</span>
                                    <span className="text-muted-foreground">
                                        /{formatInterval(plan.interval).period}
                                    </span>
                                </div>
                                {plan.interval > 1 && (
                                    <span className="text-xs text-muted-foreground mt-1">
                                        ₹{calculateMonthlyPrice(plan.price, plan.interval)}/month
                                    </span>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="space-y-3">
                                {plan.features.map((feature) => (
                                    <div key={feature.featureId}
                                        className="flex items-center gap-2 p-2 hover:bg-secondary/10 rounded-lg transition-colors">
                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span className="text-sm">
                                            {feature.name} {typeof feature.value === 'boolean' ? '' :
                                                <span className="font-medium">({feature.value})</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardContent className="pt-4">
                            <Button
                                className="w-full h-10 text-sm font-medium"
                                onClick={() => handleSubscribe(plan)}
                                disabled={isLoading === plan.id}
                            >
                                {isLoading === plan.id ? 'Processing...' : `Get ${plan.name}`}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default PremiumPlans;