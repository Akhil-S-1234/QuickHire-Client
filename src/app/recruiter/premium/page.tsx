import { RecruiterPremiumPlans } from '../components/Premium'
import  Header from '../components/Header'

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div>
        <RecruiterPremiumPlans />
      </div>
    </div>
  )
}

