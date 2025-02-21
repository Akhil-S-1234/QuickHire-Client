// app/user/checkout/[subscriptionId]/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import CheckoutComponent from '../components/Checkout'

export default function CheckoutPage() {
  const params = useSearchParams()
  const subscriptionId = params.get('planId') as string

  console.log(params, subscriptionId)

  return (
    <>
      <Header />
      <CheckoutComponent subscriptionId={subscriptionId} />
    </>
  )
}