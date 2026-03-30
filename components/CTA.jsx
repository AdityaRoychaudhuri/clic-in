import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from './ui/button'

const CTA = () => {
  return (
    <section className='py-20'>
        <div className='container mx-auto px-2'>
            <Card className='bg-gradient-to-r from-emerald-900/30 to-emerald-950/20 border-emerald-800/20'>
                <CardContent className='p-8 md:p-12 lg:p-16 relative overflow-hidden'>
                    <div>
                        <h2 className='text-3xl md:text-5xl font-bold dark:text-white mb-6'>
                            Ready to take control of your <br/>healthcare?
                        </h2>
                        <p className='text-lg text-muted-foreground mb-8'>
                            Join thousands of users who have simplified their healthcare
                            journey with our platform. Get started today and experience
                            <br/> healthcare the way it should be.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                            <Button
                                size='lg'
                                asChild
                                className="text-xl sm:text-base bg-emerald-600 dark:text-white hover:bg-emerald-700"
                            >
                                <Link href='/sign-up'>
                                    Sign up Now
                                </Link>
                            </Button>
                            <Button 
                                asChild
                                size='lg'
                                variant='outline'
                                className="text-xl sm:text-base border-emerald-700/30 hover:bg-emerald-700"
                            >
                                <Link href='/pricing'>
                                    View priecing
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