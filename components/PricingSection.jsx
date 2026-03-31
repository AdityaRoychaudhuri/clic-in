import React from 'react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { creditBenefits } from '@/lib/data'
import { Stethoscope } from 'lucide-react'
import { Check } from 'lucide-react'
import Pricing from './Pricing'

const PricingSection = () => {
  return (
    <section className='py-20'>
        <div className='container mx-auto px-4'>
            <div className='text-center mb-16'>
                <Badge
                    variant='outline'
                    className='
                    bg-primary/10 
                    border-primary/30 
                    text-primary 
                    px-4 py-1.5 
                    text-sm font-medium 
                    rounded-md 
                    mb-4
                    dark:bg-primary/30 
                    dark:border-primary/80 
                    dark:text-chart-1/65
                    '
                >
                    Affordable Healthcare
                </Badge>
                <h2 className='text-3xl md:text-6xl font-bold text-foreground mb-4'>
                    Consultation Packages
                </h2>
                <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
                    Choose the perfect consultation package that fits your healthcare needs
                </p>
            </div>

            <div>
                <Pricing/>

                <Card 
                    className='
                    mt-12 
                    bg-card 
                    border border-border
                    hover:border-primary/40
                    transition-all
                    '
                >
                    <CardHeader>
                        <CardTitle className='flex text-2xl font-semibold items-center text-foreground dark:text-white'>
                            <Stethoscope className='size-5 mr-2 text-primary dark:text-chart-1/65'/>
                            How our Credit System works
                        </CardTitle>
                    </CardHeader>

                    <CardContent className='my-2'>
                        <ul className='space-y-3'>
                            {creditBenefits.map((benefit, ind) => (
                                <li key={ind} className='flex items-center'>
                                    
                                    <div 
                                    className='
                                        mr-3 
                                        rounded-full 
                                        p-1 
                                        bg-primary/10
                                        dark:bg-emerald-900/30
                                    '
                                    >
                                        <Check className='h-4 w-4 text-primary dark:text-emerald-400'/>
                                    </div>

                                    <p
                                        className='text-muted-foreground text-[16px]'
                                        dangerouslySetInnerHTML={{ __html: benefit }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
  )
}

export default PricingSection