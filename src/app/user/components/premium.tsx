'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Calendar, CreditCard, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AxiosInstance from '../../lib/axiosInstance'

interface PlanFeature {
    id: string
    name: string
}

interface Plan {
    id: string
    name: string
    price: number
    interval: 'monthly' | 'yearly'
    features: PlanFeature[]
}

interface SubscriptionStatus {
    isActive: boolean
    type: 'monthly' | 'yearly'
    endDate: Date
    startDate: Date
}

export function PremiumPlans() {
    const [plans, setPlans] = useState<Plan[]>([])
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchPlans = async () => {
            const response = await new Promise<Plan[]>((resolve) => {
                setTimeout(() => {
                    resolve([
                        {
                            id: 'monthly',
                            name: 'Monthly Plan',
                            price: 29.99,
                            interval: 'monthly',
                            features: [
                                { id: '1', name: 'Access to all job listings' },
                                { id: '2', name: 'Unlimited job applications' },
                                { id: '3', name: 'Advanced profile customization' },
                                { id: '4', name: 'Priority support' },
                            ],
                        },
                        {
                            id: 'yearly',
                            name: 'Yearly Plan',
                            price: 299.99,
                            interval: 'yearly',
                            features: [
                                { id: '1', name: 'All Monthly Plan features' },
                                { id: '2', name: '2 months free' },
                                { id: '3', name: 'Annual resume review' },
                                { id: '4', name: 'Exclusive webinars' },
                                { id: '5', name: 'Early access to new features' },
                            ],
                        },
                    ])
                }, 1000)
            })
            setPlans(response)
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

    if (subscriptionStatus?.isActive) {
        const activePlan = plans.find(plan => plan.interval === subscriptionStatus.type)

        return (
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-center mb-8">Your Premium Subscription</h1>
                
                <div className="max-w-3xl mx-auto">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-6 w-6" />
                                {activePlan?.name}
                            </CardTitle>
                            <CardDescription>
                                Active Subscription - ₹{activePlan?.price.toFixed(2)} / {activePlan?.interval}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Start Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(subscriptionStatus.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Renewal Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(subscriptionStatus.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Premium Features</CardTitle>
                            <CardDescription>
                                Enjoy all these benefits with your subscription
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activePlan?.features.map((feature) => (
                                    <div
                                        key={feature.id}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50"
                                    >
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm">{feature.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const handleSubscribe = (plan: Plan) => {
        router.push(`/user/checkout?planId=${plan.id}&planName=${encodeURIComponent(plan.name)}&planPrice=${plan.price}&planInterval=${plan.interval}`)
    }

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold text-center mb-8">Choose Your Premium Plan</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>
                                ₹{plan.price.toFixed(2)}/{plan.interval === 'monthly' ? 'month' : 'year'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-2">
                                {plan.features.map((feature) => (
                                    <li key={feature.id} className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-green-500" />
                                        {feature.name}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardContent>
                            <Button className="w-full" onClick={() => handleSubscribe(plan)}>
                                Subscribe to {plan.name}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}