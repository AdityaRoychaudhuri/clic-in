import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { features } from '@/lib/data'

const HowItWorks = () => {
  return (
    <section className='py-20 bg-muted/30'>
      <div className='container mx-auto px-4'>
        
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-6xl font-bold text-foreground mb-4'>
            How it works
          </h2>

          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Our platform makes healthcare accessible with just a few clicks
          </p>
        </div>

        <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map((feature, ind) => (
            
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
              
              <CardHeader className='pb-2'>
                
                <div className='
                  bg-primary/10 
                  text-primary 
                  p-3 
                  rounded-lg 
                  w-fit 
                  mb-4
                  dark:bg-primary/55 
                  dark:text-green-600
                '>
                  {feature.icon}
                </div>

                <CardTitle className='
                  text-xl 
                  font-semibold 
                  text-foreground 
                  dark:text-white
                '>
                  {feature.title}
                </CardTitle>

              </CardHeader>

              <CardContent>
                <p className='text-lg text-muted-foreground'>
                  {feature.description}
                </p>
              </CardContent>

            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks