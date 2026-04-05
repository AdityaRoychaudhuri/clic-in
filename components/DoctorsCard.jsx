import React from 'react'
import { Card, CardContent } from './ui/card'
import { Calendar, Star, User } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import Link from 'next/link'

const DoctorsCard = ({ doctor }) => {
  return (
    <Card className=''>
      <CardContent className='py-4'>
        <div>
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center gap-4 flex-1">
              
              <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/55 flex items-center justify-center shrink-0">
                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="size-6 text-primary dark:text-green-600" />
                )}
              </div>

              <div className="flex flex-col">
                <h3 className="font-medium text-black dark:text-white text-lg">
                  {doctor.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {doctor.speciality} • {doctor.experience} years
                </p>
              </div>
            </div>

            <Badge className="flex items-center gap-1 shrink-0">
              <Star className="size-4" />
              Verified
            </Badge>
          </div>

          <div className='mt-4 line-clamp-2 text-sm text-muted-foreground mb-4'>
            {doctor.description}
          </div>

          <Button
            asChild
            className='w-full'
          >
            <Link
              href={`/doctors/${doctor.speciality}/${doctor.id}`}
            >
                <Calendar className='size-4'/>
                Book an appoitnment
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DoctorsCard
