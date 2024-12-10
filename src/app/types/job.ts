export interface Job {
    _id: string
    title: string
    description: string
    company: {
      name: string
      logo: string
    }
    location: string
    type: string
    salary: {
      min: number
      max: number
    }
    experience: {
      minYears: number
      maxYears?: number
    }
    requirements: {
      education: string
      skills: string[]
      certifications: string[]
    }
    postedBy: string
    createdAt: Date
    updatedAt: Date
    isActive: boolean
  }
  
  