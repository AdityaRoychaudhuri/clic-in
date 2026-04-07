"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Calendar, ChevronDown, ChevronUp, Clock, FileText, Medal, User } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import SlotPicker from './SlotPicker'
import AppointmentForm from './AppointmentForm'
import { useRouter } from 'next/navigation'

const DoctorProfile = ({ doctorData, doctorAppoitnments }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const aboutRef = useRef(null);
  const bookingRef = useRef(null);

  const router = useRouter();
  
  useEffect(() => {
    if (!showBooking) {
      bookingRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    } else {
      aboutRef.current?.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [showBooking]);


  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  }

  const handleBookingChange = () => {
    setShowBooking(prev => !prev);

  }

  const handleBookingComplete = () => {
    router.push("/appointments");
  }

  const totalSlots = doctorAppoitnments.reduce((total, day) => total + day.slots.length,0);

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {/* LEFT SECTION */}
      <div className='md:col-span-1'>
        <div className='md:sticky md:top-24'>
          <Card className='border border-accent bg-accent/40'>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center justify-center space-y-4'>
                <div className='relative size-32 overflow-hidden rounded-full mb-4 bg-primary/10 dark:bg-primary/25'>
                  {doctorData.imageUrl ? (
                    <Image
                      src={doctorData.imageUrl}
                      alt={doctorData.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <User className='size-16 text-primary dark:text-green-600'/>
                    </div>
                  )}
                </div>

                <h3 className='text-black dark:text-white font-bold text-xl'>
                  {doctorData.name}
                </h3>
                <Badge
                  variant='outline'
                  className='bg-primary/10 dark:bg-primary/25 text-primary dark:text-green-600 rounded-xs'
                >
                  {doctorData.speciality}
                </Badge>

                <div className='flex gap-2'>
                  <Medal className='size-4 text-primary dark:text-green-600'/>
                  <p className='text-muted-foreground'>
                    Years of experience
                  </p>
                </div>

                <Button 
                  className='w-full'
                  onClick={handleBookingChange}
                >
                  {showBooking ? (
                    <>
                      Hide booking
                      <ChevronUp className='size-4'/>
                    </>
                  ) : (
                    <>
                      Book Appointment
                      <ChevronDown className='size-4'/>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className='md:col-span-2 space-y-6'>
        <Card className='bg-accent/40'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold'>
              About Dr. {doctorData.name}
            </CardTitle>
            <CardDescription>
              Professional Background and expertise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={aboutRef} className='space-y-4 mb-4'>
              <div className='flex gap-2 items-center font-medium text-lg'>
                <FileText className='size-4 text-primary dark:text-green-600'/>
                Description
              </div>
              <p className='text-muted-foreground'>
                {doctorData.description}
              </p>
            </div>

            <Separator/>
            

            <div className='space-y-4 mt-4'>
              <div className='flex gap-2 items-center font-medium text-lg'>
                <Clock className='size-4 text-primary dark:text-green-600'/>
                Availability
              </div>
              {totalSlots > 0 ? (
                <p className='text-muted-foreground'>
                  <span className='font-bold'>{totalSlots}</span> time slots available for booking over the next 4 days.
                </p>
              ) : (
                <Alert className='text-muted-foreground'>
                  <AlertCircle className='size-4'/>
                  <AlertDescription>
                    No available slots for the next 4 days.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {showBooking && (
          <div ref={bookingRef}>
            <Card className='border border-accent bg-accent/40'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                  Book an appointment
                </CardTitle>
                <CardDescription>
                  Select a time slot and provide details for your consultation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showBooking ? (
                  <>
                    {true && (
                      <SlotPicker days={doctorAppoitnments} onSelectedSlot={handleSlotSelect}/>
                    )}

                    {selectedSlot && (
                      <AppointmentForm
                        doctorId={doctorData.id}
                        slot={selectedSlot}
                        onBack={setSelectedSlot(null)}
                        onComplete={handleBookingComplete}
                      />
                    )}
                  </>
                ) : (
                  <div className='text-center py-6 space-y-2'>
                    <Calendar className='size-12 mx-auto text-muted-foreground mb-3'/>
                    <h3 className='text-xl font-semibold'>
                      No available slots
                    </h3>
                    <p className='text-muted-foreground'>
                      This doctor doesn&apos;t have any available appointment slots for the next
                      4 days. Please check back later or try another doctor.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorProfile
