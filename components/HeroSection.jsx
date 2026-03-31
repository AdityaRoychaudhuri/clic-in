import React from 'react'
import { Badge } from './ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const HeroSection = () => {
  return (
    <section className='relative overflow-hidden py-32'>
      
      {/* subtle background gradient */}
      <div className='absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent dark:from-primary/20' />

      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-8'>
            
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
              Healthcare Made Simple
            </Badge>

            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
              Connect with doctors <br />
              <span className='gradient-title'>
                Anytime, Anywhere
              </span>
            </h1>

            <p className='text-muted-foreground max-w-md text-lg md:text-xl'>
              Book appointments, consult via video calling sessions, and manage your healthcare journey 
              from the comfort of your home.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              
              <Button 
                asChild 
                size='lg' 
                className='bg-primary text-primary-foreground hover:bg-primary/90'
              >
                <Link href="/onboarding">
                  Get Started <ArrowRight className='size-4'/>
                </Link>
              </Button>

              <Button 
                asChild 
                size='lg' 
                variant='outline'
                className='border-border hover:bg-accent'
              >
                <Link href="/onboarding">
                  Find Doctors
                </Link>
              </Button>

            </div>
          </div>

          {/* RIGHT */}
          <div className='relative h-[400px] lg:h-[550px]'>
            
            {/* soft glow behind image */}
            <div className='absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent rounded-xl blur-2xl' />

            <Image
              src='/banner2.png'
              alt='Doctors'
              fill
              priority
              className='object-contain lg:object-cover rounded-xl'
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection