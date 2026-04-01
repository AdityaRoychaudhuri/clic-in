import Pricing from '@/components/Pricing'
import { Badge } from '@/components/ui/badge'
import { PricingTable, } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='container mx-auto px-4 py-12'>
        <div className='flex mb-2 justify-start'>
            <Link href='/' className='flex items-center text-muted-foreground hover:text-black transition-colors dark:hover:text-white'>
                <ArrowLeft className='h-4 w-4 mr-2'/>
                Back to home page
            </Link>
        </div>

        <div className='max-w-full mx-auto mb-12 text-center'>
            <Badge 
                variant='outline'
                className='
                bg-primary/10 
                border-primary/30 
                text-primary 
                px-4 py-1.5 
                text-sm font-medium
                mb-4
                dark:bg-primary/30 
                dark:border-primary/80 
                dark:text-chart-1/65
                '
            >
                Affordable Healthcare
            </Badge>

            <h1 className='text-4xl md:text-6xl font-bold gradient-title mb-4'>
                Simple, Transparent pricing
            </h1>

            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                Choose the prefect consultation package that fits your healthcare needs with no hidden fees or long-term commitments.
            </p>
        </div>

        <Pricing/>

        <div className='max-w-3xl mx-auto mt-16 text-center'>
            <h2 className='text-2xl font-bold text-black dark:text-white mb-2'>
                Question? We're here to help!
            </h2>
            <p className='text-muted-foreground mb-4'>
                Contact our support team at support@clicin.com
            </p>
        </div>
    </div>
  )
}

export default page