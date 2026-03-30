import React from 'react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { creditBenefits } from '@/lib/data'
import { Stethoscope } from 'lucide-react'
import { Check } from 'lucide-react'

const PricingSection = () => {
  return (
    <section className='py-20'>
        <div className='container mx-auto px-2'>
            <div className='text-center mb-16'>
                <Badge
                    variant='outline'
                    className='bg-primary/30 border-primary/80 px-3 py-3 text-chart-1/65 text-sm font-medium rounded-sm mb-4'
                >
                    Affordable Healthcare
                </Badge>
                <h2 className='text-3xl md:text-6xl font-bold dark:text-white text-black mb-4'>
                    Consultation Packages
                </h2>
                <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
                    Choose the perfect consultation package that fits your healthcare needs
                </p>
            </div>

            {/* <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {features.map((feature, ind) =>(
                    <Card key={ind} className='border-2 hover:bg-primary/10 transition-colors duration-500'>
                        <CardHeader className='pb-2'>
                            <div className='bg-primary/55 text-green-600 p-3 rounded-lg w-fit mb-4'>
                                {feature.icon}
                            </div>
                            <CardTitle className='text-xl font-semibold text-white'>
                                {feature.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-muted-foreground'>
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div> */}

            <div>
                <Card className='mt-12 bg-muted/20 border-emerald-900/30'>
                    <CardHeader>
                        <CardTitle className='flex text-2xl font-semibold dark:text-white items-center'>
                            <Stethoscope className='size-5 mr-2 text-chart-1/65'/>
                            How our Credit System works
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='my-2'>
                        <ul className='space-y-3'>
                            {creditBenefits.map((benefit, ind) => (
                                <li key={ind} className='flex items-center'>
                                    <div className='mr-3 rounded-full p-1 bg-emerald-900/30'>
                                        <Check className='h-4 w-4 text-emerald-400'/>
                                    </div>
                                    <p
                                        className='text-muted-foreground text-[16px]'
                                        dangerouslySetInnerHTML={{ __html: benefit }}
                                    >
                                    </p>
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