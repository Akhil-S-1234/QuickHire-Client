// components/CheckoutComponent.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft } from 'lucide-react'
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
    interval: 'monthly' | 'yearly'
    features: PlanFeature[]
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

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Load Razorpay script
        const razorpayLoaded = await loadRazorpayScript()
        setIsRazorpayLoaded(razorpayLoaded)

        console.log(subscriptionId)

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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!planDetails || !isRazorpayLoaded) return

    try {
      const response = await AxiosInstance.post('/api/users/create-payment', {
        amount: planDetails.price * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          planId: planDetails.id,
          planName: planDetails.name,
          planInterval: planDetails.interval,
        },
      })

      const order = response.data.data

      if (order.id) {
        const options = {
          key: 'rzp_test_JkT3o5VYOxKgH3',
          amount: order.amount,
          currency: order.currency,
          name: 'Your Company Name',
          description: `Subscription for ${planDetails.name}`,
          order_id: order.id,
          handler: async function (response: any) {
            await AxiosInstance.post('/api/users/verify-payment', {
              type: planDetails.interval
            })
            window.location.href = '/user/premium'
          },
          prefill: {
            name: 'John Doe',
            email: 'john@example.com',
            contact: '9876543210',
          },
          theme: {
            color: '#3399cc',
          },
        }

        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
      }
    } catch (error: any) {
      console.error('Error creating order:', error)
      alert('An error occurred. Please try again.')
    }
  }

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
          <CardTitle className="text-2xl font-bold">Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Plan Details</h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="font-medium">{planDetails.name}</p>
                <p className="text-2xl font-bold mt-1">₹{planDetails.price.toFixed(2)} - {planDetails.interval} months</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <div className="border-t border-b py-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{planDetails.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total</span>
                  <span>₹{planDetails.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-semibold text-yellow-700">No Refunds</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Please note that all purchases are final and non-refundable. Make sure you've reviewed your selection before proceeding.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200" 
            onClick={handlePayment}
            disabled={!isRazorpayLoaded}
          >
            {isRazorpayLoaded ? 'Proceed to Payment' : 'Loading Razorpay...'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}