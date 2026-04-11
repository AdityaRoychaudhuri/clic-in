"use client"
import { generateVideoToken } from '@/actions/appointments';
import { cancelAppointment, getDoctorNotes, markAppointmentCompleted } from '@/actions/doctor';
import useFetch from '@/hooks/useFetch';
import { Calendar, CircleCheck, Clock, Loader2, Stethoscope, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Card, CardAction, CardContent, CardHeader,CardDescription, CardFooter, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';

const AppointmentCard = ({ appointments, userRole }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [notes, setNotes] = useState(appointments.notes || "");
  console.log(appointments)
  console.log(appointments.patient.email);
  console.log(appointments.patient.name);

  const {
    data: cancelAppointmentData,
    loading: cancelAppointmentLoading,
    error: cancelAppointmentError,
    fetchData: cancelAppointmentFn,
    setData: cancelAppointmentSetData,
  } = useFetch(cancelAppointment);

  const {
    data: getDoctorNotesData,
    loading: getDoctorNotesLoading,
    error: getDoctorNotesError,
    fetchData: getDoctorNotesFn,
    setData: getDoctorNotesSetData
  } = useFetch(getDoctorNotes);

  const {
    data: markData,
    loading: markLoading,
    error: markError,
    fetchData: markFn,
    setData: markSetData
  } = useFetch(markAppointmentCompleted)

  const {
    data: generateVideoData,
    loading: generateVideoLoading,
    error: generateVideoError,
    fetchData: generateVideoFn,
    setData: generateVideoSetData
  } = useFetch(generateVideoToken)

  const otherUserInfo = userRole === "DOCTOR" ? appointments.patient : appointments.doctor;
  console.log(otherUserInfo);

  const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
  const otherPartyIcon = userRole === "DOCTOR" ? <User className=''/> : <Stethoscope/>;

  const formatDateTime = (dateTime) => {
    const formatted = format(new Date(dateTime), "MMMM d, yyyy 'at' h:mm a");
    return formatted;
  }

  const formatTime = (time) => {
    const formatted = format(new Date(time), "h:mm a");
    return formatted;
  }

  const canMarkCompleted = () => {
    if (userRole !== "DOCTOR" || appointments.status !== "SCHEDULED") {
      return false;
    }

    const now = new Date();
    const appointmentEndTime = new Date(appointments.endTime);
    return now >= appointmentEndTime;
  }

  const handleMarkCompleted = async () => {
    if (markLoading) {
      return;
    }

    if (window.confirm("Are you sure? This action cannot be undone")) {
      const formData = new FormData();
      formData.append("appointmentId", appointments.id);
      await markFn(formData);
    }
  }

  useEffect(() => {
    if (markData?.success) {
      toast.success("Appointment marked as complete");
      setDialogOpen(false);
    }
  }, [markData]);
  

  return (
    <>

      <Card className='bg-accent/30 dark:bg-background/40 border-green-900/20 hover:border-green-900/40 transition-all'>
        <CardHeader className='flex items-center text-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <div className='rounded-full border border-green-800/40 dark:border-none p-3 flex items-center justify-center'>
              {otherPartyIcon}
            </div>
            <div className='flex gap-1 flex-col'>
              <h3 className='font-semibold text-base text-start'>
                {userRole === "DOCTOR" ? (
                  otherUserInfo?.name
                ) : (
                  `Dr. ${otherUserInfo.name}`
                )}
              </h3>

              <p className='text-sm text-muted-foreground'>
                { userRole === "DOCTOR" ? (
                  otherUserInfo.email
                ) : (
                  otherUserInfo.speciality
                ) }
              </p>

            </div>
          </div>
          <CardAction>
            <Badge
              className={`${
                appointments.status === "COMPLETED" ?
                "bg-primary/10 border-primary/30 dark:bg-primary/30 dark:border-primary/80 text-green-700 dark:text-chart-1" :
                appointments.status === "SCHEDULED" ?
                "bg-amber-400/30 border-amber-400/40 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400" : 
                "bg-red-400/30 border-red-400/40 text-red-700 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400"
              } rounded-xs`}
              variant='outline'
            >
              {appointments.status}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className='py-0 space-y-2 flex flex-col md:flex-row md:items-center md:justify-between'>
          <div className='px-4 text-sm text-muted-foreground'>
            <div className='flex gap-1 items-center'>
              <Calendar className='size-4 text-green-700 dark:text-green-600 items-center'/>
              <p>
                {formatDateTime(appointments.startTime)}
              </p>
            </div>

            <div className='flex gap-1 items-center'>
              <Clock className='size-4 text-green-700 dark:text-green-600'/>
              <p>
                {formatTime(appointments.startTime)} - {formatTime(appointments.endTime)}
              </p>
            </div>

          </div>
          <div className='flex justify-between md:justify-center gap-2 flex-wrap mt-4 md:mt-0'>
            {canMarkCompleted() && (
              <Button
                size='sm'
                onClick={handleMarkCompleted}
              >
                {markLoading ? (
                  <>
                    <Loader2 className='size-4 animate-spin'/>
                    Marking...
                  </>
                ) : (
                  <>
                    <CircleCheck className='size-4'/>
                    Completed
                  </>
                )}
              </Button>
            )}

            <Button
              variant='outline'
              size='sm'
              onClick={() => setDialogOpen(true)}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
      {setDialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className='text-black dark:text-white text-2xl font-bold'>
                Appointment details
              </DialogTitle>
              <DialogDescription className='text-sm'>
                {appointments.status === "SCHEDULED" ? (
                  "Manage your upcoming appointment"
                ) : (
                  "View appointment information"
                )}
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  {otherPartyLabel}
                </h4>

                <div className='flex items-center mx-auto'>
                  <div className='h-6 w-6 mr-2'>
                    {otherPartyIcon}
                  </div>

                  <div className=''>
                    <p className='text-black dark:text-white font-medium'>
                      {userRole === "DOCTOR" ? 
                      otherUserInfo.name : `
                        Dr. ${otherUserInfo.name}
                      `}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      { userRole === "DOCTOR" ? (
                        otherUserInfo.email
                      ) : (
                        otherUserInfo.speciality
                      ) }
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Scheduled Time
                </h4>

                <div className='space-y-1 items-center'>
                  <div className='flex gap-1 items-center flex-wrap'>
                    <Calendar className='size-4 text-green-700 dark:text-green-600'/>
                    <p>
                      {formatDateTime(appointments.startTime)}
                    </p>
                  </div>

                  <div className='flex gap-1 items-center'>
                    <Clock className='size-4 text-green-700 dark:text-green-600'/>
                    <p>
                      {formatTime(appointments.startTime)} - {formatTime(appointments.endTime)}
                    </p>
                  </div>
                </div>

              </div>

              <div className='space-y-2'>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Status
                </h4>
                <Badge
                  className={`${
                    appointments.status === "COMPLETED" ?
                    "bg-primary/10 border-primary/30 dark:bg-primary/30 dark:border-primary/80 text-green-700 dark:text-chart-1" :
                    appointments.status === "SCHEDULED" ?
                    "bg-amber-400/30 border-amber-400/40 text-amber-700 dark:bg-amber-900/20 dark:border-amber-900/30 dark:text-amber-400" : 
                    "bg-red-400/30 border-red-400/40 text-red-700 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400"
                  } rounded-xs`}
                  variant='outline'
                  >
                  {appointments.status}
                </Badge>
              </div>
              {appointments.patientDescription && (
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    {userRole === "DOCTOR" ? "Patient Description" : "Your Description"}
                  </h4>

                  <div className='p-3 rounded-md bg-muted/30 border border-green-900/20'>
                    <p className='text-black dark:text-white whitespace-pre-line'>
                      {appointments.patientDescription}
                    </p>
                  </div>
                </div>
              )}

              <div>

              </div>
            </div>
            
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default AppointmentCard
