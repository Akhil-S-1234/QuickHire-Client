'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, Calendar, CreditCard, Clock, Shield, 
  RefreshCcw, AlertCircle, History, CreditCard as CardIcon 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import type { ISubscription, Plan } from './types';
import AxiosInstance from '../../lib/axiosInstance';

export function PremiumPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subRes] = await Promise.all([
          AxiosInstance.get('/api/users/subscriptionPlans'),
          AxiosInstance.get('/api/users/subscription')
        ]);
        setPlans(plansRes.data.data);
        setSubscription(subRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const formatInterval = (interval: number) => {
    if (interval === 1) return { period: 'month', label: 'Monthly' };
    if (interval === 12) return { period: 'year', label: 'Yearly' };
    return { period: `${interval} months`, label: `${interval}-Month` };
  };

  const calculateMonthlyPrice = (price: number, interval: number) => {
    return (price / interval).toFixed(2);
  };

  const handleSubscribe = async (plan: any) => {
    try {
      setIsLoading(plan.id);
      router.push(`/user/checkout?planId=${plan.id}`);
    } catch (error) {
      console.error('Error initiating subscription:', error);
    } finally {
      setIsLoading(null);
    }
  };

  if (subscription?.status === 'active') {
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
                    {subscription.name}
                  </CardTitle>
                  <CardDescription className="mt-2 text-lg">
                    ₹{subscription.price.toFixed(2)} / {formatInterval(subscription.interval).period}
                  </CardDescription>
                </div>
                <div className="px-4 py-2 bg-primary/10 rounded-full">
                  <span className="text-sm font-medium text-primary capitalize">{subscription.status}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Subscription Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(subscription.currentPeriodStart).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Next Billing Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                  <CardIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">
                      {subscription.paymentMethod.type} •••• {subscription.paymentMethod.last4}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                  <RefreshCcw className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Auto Renewal</p>
                    <p className="text-sm text-muted-foreground">
                      {subscription.autoRenewal ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>

                {subscription.billingAttempts > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg">
                    <History className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Billing Attempts</p>
                      <p className="text-sm text-muted-foreground">
                        {subscription.billingAttempts} attempts made
                      </p>
                    </div>
                  </div>
                )}

                {subscription.failureReason && (
                  <div className="flex items-center gap-3 p-4 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Last Failure Reason</p>
                      <p className="text-sm text-red-600">{subscription.failureReason}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Features Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Your Premium Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscription.features.map((feature: any) => (
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

              {/* Payment History */}
              {subscription.renewalHistory.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                  <div className="space-y-3">
                    {subscription.renewalHistory.map((renewal: any) => (
                      <div key={renewal.paymentId} 
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/10">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              ₹{renewal.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(renewal.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm ${
                            renewal.status === 'success' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {renewal.status}
                          </span>
                          {renewal.failureReason && (
                            <p className="text-xs text-red-500">{renewal.failureReason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Plans display section remains the same as in your original code
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">Choose Your Premium Plan</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Select the plan that best suits your needs. All plans include our core premium features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.sort((a, b) => a.interval - b.interval).map((plan) => (
          <Card key={plan.id} className="flex flex-col hover:border-primary/50 transition-colors duration-300">
            <CardHeader className="text-center pb-4 space-y-2">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">₹{plan.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">/{formatInterval(plan.interval).period}</span>
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
                {plan.features.map((feature: any) => (
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
  );
}