import React from 'react'
import { Badge } from './ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden py-32'>
        <div className='container mx-auto px-2'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                <div className='space-y-8'>
                    <Badge 
                        variant='outline'
                        className='bg-primary/30 border-primary/80 px-3 py-3 text-chart-1/65 text-sm font-medium rounded-sm'
                    >
                        Healthcare Made simple
                    </Badge>
                    <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'>
                        Connect with doctors <br/> {" "} <span className='gradient-title'>Anytime, Anywhere</span>
                    </h1>

                    <p className='text-muted-foreground max-w-md text-lg md:text-xl'>
                        Book appointments, consult via video calling sessions, and manage your healthcare journey 
                        from the comfort of your home.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Button asChild size='lg' className='text-white hover:bg-primary/85'>
                            <Link href="/onboarding">
                                Get Started <ArrowRight className='size-4'/>
                            </Link>
                        </Button>
                        <Button asChild size='lg' variant='outline'>
                            <Link href="/onboarding">
                                Find Doctors
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className='relative h-100 lg:h-145 rounded-xl overflow-hidden'>
                    <Image
                        src='/banner2.png'
                        alt='Doctors'
                        width={1600}
                        height={900}
                        priority
                        className='object-cover md:pt-14 rounded-xl'
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection