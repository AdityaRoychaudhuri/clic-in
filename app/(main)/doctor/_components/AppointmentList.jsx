import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, AlertCircle } from 'lucide-react'
import React from 'react'
import AppointmentCard from '@/components/AppointmentCard'

const AppointmentList = ({ appointmentList }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex gap-2 text-xl dark:text-white text-black font-bold items-center'>
          <Calendar className='size-5 text-green-800 dark:text-green-600'/>
          Upcoming Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointmentList.length > 0 ? (
          <div className='space-y-4'>
            {appointmentList.map((appointment) => (
              <AppointmentCard key={appointment.id} appointments={appointment} userRole="DOCTOR"/>
            ))}
          </div>
        ) : (
          <div className=''>
            <Alert className='text-center text-muted-foreground'>
              <AlertDescription className='flex justify-center items-center gap-1 py-8 text-sm'>
                <AlertCircle className='size-4'/>
                You don&apos;t have any scheduled appointments yet. Make sure you have set your availability
                to allow patients to book.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AppointmentList
