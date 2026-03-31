import React from 'react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { testimonials } from '@/lib/data'

const TestimonialSection = () => {
  return (
    <section className='py-20 bg-muted/30'>
      <div className='container mx-auto px-4'>
        <div className='text-center mb-16'>
          <Badge
            variant='outline'
            className='
              mb-4 
              bg-primary/10 
              border-primary/30 
              text-primary 
              px-4 py-1.5 
              text-sm font-medium 
              rounded-md
              dark:bg-primary/30 
              dark:border-primary/80 
              dark:text-chart-1/65
            '
          >
            Success Stories
          </Badge>

          <h2 className='text-3xl md:text-6xl font-bold text-foreground mb-4'>
            What our users say
          </h2>

          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Hear from our doctors and patients 
          </p>
        </div>

        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          
          {testimonials.map((testimonial, ind) => (
            
            <Card
              key={ind}
              className='
                bg-card 
                border border-border
                hover:border-primary/40
                hover:bg-primary/5
                hover:shadow-md
                transition-all duration-300
              '
            >
              
              <CardContent className='space-y-6 p-6'>
                
                <div className='flex items-center'>
                  
                  <div 
                    className='
                      size-12 
                      flex items-center justify-center 
                      rounded-full 
                      bg-primary/10 
                      mr-4
                      dark:bg-primary/55
                    '
                  >
                    <span className='font-bold text-primary dark:text-green-600'>
                      {testimonial.initials}
                    </span>
                  </div>

                  <div>
                    <h4 className='font-semibold text-lg text-foreground dark:text-white'>
                      {testimonial.name}
                    </h4>
                    <p className='text-sm text-muted-foreground/70'>
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <p className='text-lg text-muted-foreground italic leading-relaxed'>
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