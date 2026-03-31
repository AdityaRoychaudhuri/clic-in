import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from './ui/button'

const CTA = () => {
  return (
    <section className='py-20'>
      <div className='container mx-auto px-4'>
        <Card
          className='
            relative overflow-hidden
            bg-gradient-to-r 
            from-primary/15 
            via-primary/5 
            to-transparent
            dark:from-primary/30 
            dark:via-primary/20
            border border-border
          '
        >
          <CardContent className='p-8 md:p-12 lg:p-16'>
            <div className='max-w-2xl'>
              <h2 className='text-3xl md:text-5xl font-bold text-foreground dark:text-white mb-6'>
                Ready to take control of your healthcare?
              </h2>
              <p className='text-lg text-muted-foreground mb-8'>
                Join thousands of users who have simplified their healthcare
                journey with our platform. Get started today and experience
                healthcare the way it should be.
              </p>

              <div className='flex flex-col sm:flex-row gap-4'>
                
                <Button
                  size='lg'
                  asChild
                  className='text-base bg-primary text-primary-foreground hover:bg-primary/90'
                >
                  <Link href='/sign-up'>
                    Sign up Now
                  </Link>
                </Button>

                <Button 
                  asChild
                  size='lg'
                  variant='outline'
                  className='
                    text-base 
                    border-border 
                    hover:bg-accent 
                    hover:text-accent-foreground
                    dark:border-emerald-700/30 
                    dark:hover:bg-emerald-700
                  '
                >
                  <Link href='/pricing'>
                    View pricing
                  </Link>
                </Button>

              </div>

            </div>

          </CardContent>
        </Card>

      </div>
    </section>
  )
}

export default CTA