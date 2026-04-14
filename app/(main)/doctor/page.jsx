import { getDoctorAppointments, getDoctorAvailability } from '@/actions/doctor';
import { getUserInfo } from '@/actions/onboarding'
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, HandCoins } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import AvailabilitySlots from './_components/AvailabilitySlots';
import AppointmentList from './_components/AppointmentList';
import AppointmentPayout from './_components/AppointmentPayout';

const page = async () => {
  const user = await getUserInfo();

  if (user.role != "DOCTOR") {
    redirect("/onboarding");
  }

  if (user.verificationStatus != "VERIFIED") {
    redirect("/doctor/verification");
  }

  const [availableSlots, doctorAppointments] = await Promise.all([
    getDoctorAvailability(),
    getDoctorAppointments(),
  ]);

  return (
    <div>
      <Tabs 
        defaultValue="appointments" 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        orientation='vertical'
      >
        <TabsList
            className='md:col-span-1 h-14 md:h-fit w-full rounded-md bg-muted/45 flex sm:flex-row md:flex-col p-2 sm:p-1 space-y-2 md:space-y-1 sm:space-x-2 md:space-x-0'
        >
          <TabsTrigger 
              value="appointments"
              className='p-2 flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full'
          >
              <Calendar className='size-4 hidden md:inline'/>
              <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger 
              value="availability"
              className='p-2 flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full'
          >
              <Clock className='size-4 hidden md:inline'/>
              <span>Availability</span>
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className='flex-1 p-2 w-full md:flex md:items-center md:justify-start md:px-4 md:py-3'
          >
            <HandCoins className='size-4 hidden md:inline'/>
            <span>Payouts</span>
          </TabsTrigger>
        </TabsList>
        
        <div className='md:col-span-3'>
          <TabsContent value='appointments'>
            <div>
              <AppointmentList appointmentList={doctorAppointments.appointments || []}/>
            </div>
          </TabsContent>
          <TabsContent value='availability'>
            <div className='md:col-span-3'>
              <AvailabilitySlots slots={availableSlots.slots || []}/>
            </div>
          </TabsContent>
          <TabsContent value='payouts'>
            <div>
              <AppointmentPayout/>
            </div>
          </TabsContent>
        </div>

      </Tabs>
    </div>
  )
}

export default page
