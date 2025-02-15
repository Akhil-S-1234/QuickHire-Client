'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'
import Header from '../../../components/Header'
import AxiosInstance from '../../lib/axiosInstance'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/router'

interface CheckoutProps {
  planId: string
  planName: string
  planPrice: number
  planInterval: 'monthly' | 'yearly'
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

export default function RecruiterCheckoutPage() {
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutProps | null>(null)
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const planId = searchParams.get('planId')
    const planName = searchParams.get('planName')
    const planPrice = searchParams.get('planPrice')
    const planInterval = searchParams.get('planInterval') as 'monthly' | 'yearly'

    if (planId && planName && planPrice && planInterval) {
      setCheckoutDetails({
        planId,
        planName,
        planPrice: parseFloat(planPrice),
        planInterval,
      })
    }

    loadRazorpayScript().then((loaded) => {
      setIsRazorpayLoaded(loaded)
    })
  }, [searchParams])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkoutDetails || !isRazorpayLoaded) return

    try {
      const response = await AxiosInstance.post('/api/users/create-payment', {
        amount: checkoutDetails.planPrice * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          planId: checkoutDetails.planId,
          planName: checkoutDetails.planName,
          planInterval: checkoutDetails.planInterval,
        },
      })

      const order = response.data.data

      if (order.id) {
        const options = {
          key: 'rzp_test_JkT3o5VYOxKgH3',
          amount: order.amount,
          currency: order.currency,
          name: 'Recruiter Platform',
          description: `Subscription for ${checkoutDetails.planName}`,
          order_id: order.id,
          handler: function (response: any) {
            const res = AxiosInstance.post('/api/recruiters/verify-payment', {
                type: checkoutDetails.planInterval
            })

            window.location.href = '/recruiter/premium'
            
            console.log(res)
          },
          prefill: {
            name: 'Recruiter Name',
            email: 'recruiter@company.com',
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

  if (!checkoutDetails) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Header />
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
            <CardTitle className="text-2xl font-bold">Complete Your Recruiter Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Plan Details</h3>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="font-medium">{checkoutDetails.planName}</p>
                  <p className="text-2xl font-bold mt-1">₹{checkoutDetails.planPrice.toFixed(2)}/{checkoutDetails.planInterval}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <div className="border-t border-b py-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{checkoutDetails.planPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-2">
                    <span>Total</span>
                    <span>₹{checkoutDetails.planPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
                <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-yellow-700">No Refunds</p>
                  <p className="text-sm text-yellow-600 mt-1">Recruiter subscriptions are final and non-refundable. Please review your plan carefully before proceeding.</p>
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
    </>
  )
}