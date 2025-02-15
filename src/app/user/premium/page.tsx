import { PremiumPlans } from '../components/premium'
import  Header from '../../../components/Header'

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div>
        <PremiumPlans />
      </div>
    </div>
  )
}

