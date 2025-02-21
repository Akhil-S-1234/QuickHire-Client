import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SubscriptionViewProps {
  subscription: {
    name: string
    price: number
    interval: number
    userType: string
    features: { featureId : string; name: string; value: any }[]
  }
}

export function SubscriptionView({ subscription }: SubscriptionViewProps) {

  const intervalText = subscription.interval >= 12 ? `${subscription.interval / 12} year(s)` : `${subscription.interval} month(s)`

  console.log(subscription)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{subscription.name}</CardTitle>
        <CardDescription>Subscription Details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Price:</strong> ₹{subscription.price}
        </div>
        <div>
          <strong>Interval:</strong> {intervalText}
        </div>
        <div>
          <strong>User Type:</strong> {subscription.userType}
        </div>
        <div>
          <strong>Features:</strong>
          <ul className="list-disc list-inside">
            {subscription.features.map((feature) => (
              <li key={feature.featureId }>{feature.name}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

