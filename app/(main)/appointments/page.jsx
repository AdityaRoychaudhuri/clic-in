import { getPatientAppointments } from '@/actions/patient';
import { checkUser } from '@/lib/checkUser'
import { redirect } from 'next/navigation';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import { Calendar } from 'lucide-react';
import AppointmentCard from '@/components/AppointmentCard';

const page = async () => {
  const user = await checkUser();

  if (!user || user.role !== "PATIENT") {
    redirect("/onboarding");
  }

  const { patientAppointments, success } = await getPatientAppointments();

  console.log(patientAppointments);
  

  return (
    <div>
      <Card>
        <CardContent>
          {patientAppointments.length > 0  ? (
            <div className='space-y-4'>
              {patientAppointments.map((appointment) => (
                <AppointmentCard
                 appointments={appointment}
                 userRole="PATIENT"
                 key={appointment.id}
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <Calendar className='size-12 mx-auto mb-3 text-muted-foreground'/>
              <h3 className='text-2xl font-semibold text-black dark:text-white mb-2'>
                No appointments scheduled
              </h3>
              <p className='text-muted-foreground'>
                Your dont&apos;t have any appointments scheduled yet. Browse our doctors list
                and book your first appointment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default page
