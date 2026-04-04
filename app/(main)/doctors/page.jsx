import { Card, CardContent } from '@/components/ui/card'
import { SPECIALTIES } from '@/lib/specialities'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <div className='flex flex-col items-center justify-center mb-8'>
        <h1 className='text-5xl font-bold text-black dark:text-white mb-2 gradient-title'>
          Find Your Doctor
        </h1>
        <p className='text-muted-foreground text-lg'>
          Browse by speciality or view all available healthcare providers
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {SPECIALTIES.map((item, id) => (
          <Link href={`/doctors/${item.name}`} key={id}>
            <Card className='h-full'>
              <CardContent className='p-12 flex flex-col justify-center items-center text-center h-full'>
                <div className='w-12 h-12 flex justify-center items-center  bg-primary/10 dark:bg-primary/55 text-primary dark:text-green-600 rounded-full mb-4'>
                  <div className=''>
                    {item.icon}
                  </div>
                </div>
                <h1 className='font-medium text-black dark:text-white text-base'>
                  {item.name}
                </h1>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default page
