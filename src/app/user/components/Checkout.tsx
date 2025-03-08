'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
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
    razorpayPlanId: string
}

interface CheckoutComponentProps {
    subscriptionId: string
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutComponent({ subscriptionId }: CheckoutComponentProps) {
  const [planDetails, setPlanDetails] = useState<Plan | null>(null)
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [autoRenewal, setAutoRenewal] = useState(false)

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const razorpayLoaded = await loadRazorpayScript()
        setIsRazorpayLoaded(razorpayLoaded)

        const response = await AxiosInstance.get(`/api/users/subscriptionPlans/${subscriptionId}`)
        setPlanDetails(response.data.data)
      } catch (error) {
        console.error('Error initializing checkout:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeCheckout()
  }, [subscriptionId])

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planDetails || !isRazorpayLoaded) return

    try {
      // Create order or subscription based on auto-renewal choice
      // const endpoint = autoRenewal ? '/api/users/create-subscription' : '/api/users/create-order'
      const paymentResponse = await AxiosInstance.post('/api/users/create-payment', {
        planId: planDetails.razorpayPlanId,
        totalCount: autoRenewal ? 12 : 1,
        interval: planDetails.interval,
        amount: planDetails.price * 100,
        autoRenewal: autoRenewal
      })

      const paymentData = paymentResponse.data.data

      const baseOptions = {
        key: 'rzp_test_JkT3o5VYOxKgH3',
        name: 'Your Company Name',
        description: `${autoRenewal ? 'Auto-renewable' : 'One-time'} subscription for ${planDetails.name}`,
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9876543210'
        },
        theme: {
          color: '#3399cc'
        },
        notes: {
          planId: planDetails.id,
          planName: planDetails.name,
          autoRenewal: autoRenewal
        }
      }

      // Configure options based on payment type
      const options = autoRenewal ? {
        ...baseOptions,
        subscription_id: paymentData.id,
        recurring: 1,
        payment_capture: true,
        config: {
          display: {
            blocks: {
              banks: {
                name: "Pay via Card or UPI Mandate",
                instruments: [
                  { method: "card" },
                  { method: "upi", types: ["mandate"] }
                ]
              }
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async function (response: any) {
          try {
            await AxiosInstance.post('/api/users/activate-subscription', {
              subscriptionId: paymentData.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpaySignature: response.razorpay_signature,
              autoRenewal: true,
              planDetails: {
                planId: planDetails.id,
                name: planDetails.name,
                price: planDetails.price,
                interval: planDetails.interval,
                features: planDetails.features
              }
            })
            window.location.href = '/user/premium'
          } catch (error) {
            console.error('Error activating subscription:', error)
            alert('Payment successful but activation failed. Please contact support.')
          }
        }
      } : {
        ...baseOptions,
        order_id: paymentData.id,
        amount: planDetails.price * 100,
        currency: "INR",
        payment_capture: 1,
        config: {
          display: {
            blocks: {
              banks: {
                name: "Choose Payment Method",
                instruments: [
                  { method: "card" },
                  { method: "upi" },
                  { method: "netbanking" }
                ]
              }
            },
            sequence: ["block.banks"],
            preferences: {
              show_default_blocks: false
            }
          }
        },
        handler: async function (response: any) {
          try {
            await AxiosInstance.post('/api/users/activate-order', {
              orderId: paymentData.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              planDetails: {
                planId: planDetails.id,
                name: planDetails.name,
                price: planDetails.price,
                interval: planDetails.interval,
                features: planDetails.features
              }
            })
            window.location.href = '/user/premium'
          } catch (error) {
            console.error('Error activating order:', error)
            alert('Payment successful but activation failed. Please contact support.')
          }
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      
      razorpay.on('payment.failed', function(response: any) {
        console.error('Payment failed:', response.error)
        alert('Payment failed. Please try again.')
      })

      razorpay.open()
    } catch (error: any) {
      console.error('Error creating payment:', error)
      alert('An error occurred. Please try again.')
    }
  }

  // Rest of the component remains the same...
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!planDetails) {
    return <div>Plan not found</div>
  }

  return (
    <div className="container mx-auto py-12 px-4 relative">
      <div
        onClick={() => window.history.back()}
        className="absolute top-0 left-0 mt-4 ml-4 cursor-pointer flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2" size={20} />
        <span className="font-semibold text-lg">Back</span>
      </div>

      <Card className="max-w-lg mx-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Subscribe to {planDetails.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Plan Details</h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-medium">{planDetails.name}</p>
                <p className="text-2xl font-bold mt-1">
                  ₹{planDetails.price.toFixed(2)} / {planDetails.interval} {planDetails.interval === 1 ? 'month' : 'months'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-md">
              <Checkbox 
                id="auto-renewal"
                checked={autoRenewal}
                onCheckedChange={(checked) => setAutoRenewal(checked as boolean)}
              />
              <div>
                <label 
                  htmlFor="auto-renewal" 
                  className="font-medium text-blue-900 cursor-pointer"
                >
                  Enable Auto-Renewal
                </label>
                <p className="text-sm text-blue-700 mt-1">
                  Your subscription will automatically renew every {planDetails.interval} {planDetails.interval === 1 ? 'month' : 'months'} at ₹{planDetails.price.toFixed(2)}. 
                  You can cancel anytime from your account settings.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                {planDetails.features.map((feature, index) => (
                  <li key={index}>{feature.name}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Billing Summary</h3>
              <div className="border-t border-b py-2">
                <div className="flex justify-between">
                  <span>Subscription fee</span>
                  <span>₹{planDetails.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total (inc. GST)</span>
                  <span>₹{planDetails.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-yellow-700">Payment Information</p>
                <p className="text-sm text-yellow-600 mt-1">
                  {autoRenewal 
                    ? "You'll be charged immediately and automatically every billing period unless cancelled." 
                    : "This is a one-time payment. You'll need to manually renew your subscription."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200" 
            onClick={handleSubscription}
            disabled={!isRazorpayLoaded}
          >
            {isRazorpayLoaded ? (autoRenewal ? 'Subscribe with Auto-Renewal' : 'Subscribe Once') : 'Loading Razorpay...'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}