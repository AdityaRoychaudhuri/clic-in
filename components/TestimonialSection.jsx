import React from 'react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testimonials } from '@/lib/data'

const TestimonialSection = () => {
  return (
    <section className='py-20 bg-muted/30'>
        <div className='container mx-auto px-2'>
            <div className='text-center mb-16'>
                <Badge
                    variant='outline'
                    className='mb-4 bg-primary/30 border-primary/80 px-3 py-3 text-chart-1/65 text-sm font-medium rounded-sm'
                >
                    Success Stories
                </Badge>
                <h2 className='text-3xl md:text-6xl font-bold dark:text-white text-black mb-4'>
                    What our users say
                </h2>
                <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
                    Hear from our doctors and patients 
                </p>
            </div>
            <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {testimonials.map((testimonial, ind) =>(
                    <Card key={ind} className='border-2 hover:bg-primary/10 transition-colors duration-500'>
                        <CardContent className='space-y-6'>
                            <div className='flex items-center'>
                                <div className='size-12 items-center justify-center rounded-full bg-primary/55 flex mr-4'>
                                    <span className='text-green-600 font-bold'>{testimonial.initials}</span>
                                </div>
                                <div>
                                    <h4 className='font-semibold dark:text-white text-lg'>{testimonial.name}</h4>
                                    <p className='text-sm text-muted-foreground/65'>{testimonial.role}</p>
                                </div>
                            </div>
                            <p className='text-lg text-muted-foreground italic'>
                                &quot;{testimonial.quote}&quot;
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
  )
}

export default TestimonialSection