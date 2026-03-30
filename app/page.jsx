import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { creditBenefits, testimonials } from '@/lib/data'
import { Check, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import HeroSection from '@/components/HeroSection'
import HowItWorks from '@/components/HowItWorks'
import PricingSection from '@/components/PricingSection'
import TestimonialSection from '@/components/TestimonialSection'
import CTA from '@/components/CTA'

const page = () => {
  return (
    <div className='bg-background'>

        {/* Hero Section */}
        <HeroSection/>

        {/* How it works */}

        <HowItWorks/>

        {/* Packages */}

        <PricingSection/>

        {/* Testimonials */}

        <TestimonialSection/>

        {/* CTA */}

        <CTA/>

    </div>
    
  )
}

export default page