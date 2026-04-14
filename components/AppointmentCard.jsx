"use client"
import { generateVideoToken } from '@/actions/appointments';
import { cancelAppointment, getDoctorNotes, markAppointmentCompleted } from '@/actions/doctor';
import useFetch from '@/hooks/useFetch';
import { Calendar, CircleCheck, Clock, Edit, Loader2, Stethoscope, User, Video, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Card, CardAction, CardContent, CardHeader } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Textarea } from './ui/textarea';

const AppointmentCard = ({ appointments, userRole }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [notes, setNotes] = useState(appointments.notes || "");

  const router = useRouter();

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

  const isAppointmentActive = () => {
    const now = new Date();
    const appointmentStartTime = new Date(appointments.startTime);
    const appointmentEndTime = new Date(appointments.endTime);

    return (
      (appointmentStartTime.getTime() - now.getTime() <= 30*60*1000 && now < appointmentStartTime) ||
      (now >= appointmentStartTime && now <= appointmentEndTime)
    )
  }

  const handleJoinVideoCall = async () => {
    if (generateVideoLoading) {
      return;
    }

    setAction("video");
    const formData = new FormData();
    formData.append("appointmentId", appointments.id);
    await generateVideoFn(formData);
  }

  const handleSaveNotes = async () => {
    if (getDoctorNotesLoading && userRole !== "DOCTOR") {
      return
    }

    const formData = new FormData();

    formData.append("appointmentId", appointments.id);
    formData.append("notes", notes);

    await getDoctorNotesFn(formData);
  }

  const handleCancelAppointment = async () => {
    if (cancelAppointmentLoading) {
      return;
    }

    if (window.confirm("Are you sure to cancel this appointment?  This action cannot be undone")) {
      const formData = new FormData();

      formData.append("appointmentId", appointments.id);

      await cancelAppointmentFn(formData);
    }
  }

  useEffect(() => {
    if (generateVideoData?.success) {
      router.push(`/video-call?sessionId=${generateVideoData.videoSessionId}&token=${generateVideoData.token}&appointmentId=${appointments.id}`);
    }
  }, [generateVideoData, appointments.id]);

  useEffect(() => {
    if (cancelAppointmentData?.success) {
      toast.success("Appointment cancelled successfully");
      setDialogOpen(false);
    }
  }, [cancelAppointmentData])
  
  
  useEffect(() => {
    if (getDoctorNotesData?.success) {
      toast.success("Notes added successfully");
      setAction(null);
    }
  }, [getDoctorNotesData])
  

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

              <p className='text-sm text-muted-foreground self-start'>
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
          <div className='text-sm md:px-4 text-muted-foreground'>
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

              {appointments.status === "SCHEDULED" && (
                <div className='space-y-2'>
                  <h4 className='text-sm font-bold text-muted-foreground'>
                    Video Consultation
                  </h4>
                  <Button
                    className='w-full hover:bg-primary/75 transition-all cursor-pointer text-sm'
                    disabled={!isAppointmentActive() || action === "video" || generateVideoLoading}
                    onClick = {handleJoinVideoCall}
                  >
                    {generateVideoLoading || action === "video" ? (
                      <>
                        <Loader2 className='size-4 animate-spin'/>
                        Preparing video call
                      </>
                    ) : (
                      <>
                        <Video className='size-4'/>
                        {isAppointmentActive() ? 
                        "Join Video Call" :
                        "Will be available 30 minutes before appointment"}
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <h4 className='text-sm font-bold text-muted-foreground'>
                    Notes
                  </h4>

                  {userRole === "DOCTOR" && action!=="notes" && appointments.status !== "CANCELLED" && (
                    <Button
                      variant='ghost'
                      className='h-7 hover:bg-primary/75 transition-all'
                      size='sm'
                      onClick={() => setAction("notes")}
                    >
                      <Edit className='h-3.5 w-3.5'/>
                      {appointments.notes ? "Edit" : "Add"}
                    </Button>
                  )}
                </div>

                {userRole === "DOCTOR" && action === "notes" ? (
                  <div>
                    <Textarea
                      onChange={(e) => setNotes(e.target.value)}
                      value={notes}
                      placeholder="Enter your clinical notes here..."
                      className='min-h-25'
                    />

                    <div className='flex justify-between items-center mt-2'>
                      <Button
                        className=''
                        type='button'
                        variant='outline'
                        size='sm'
                        disabled={getDoctorNotesLoading}
                        onClick={() => {
                          setAction(null);
                          setNotes(appointments.notes || "");
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        onClick={handleSaveNotes}
                        size='sm'
                        disabled={getDoctorNotesLoading}
                      >
                        {getDoctorNotesLoading ? (
                          <>
                            <Loader2 className='size-4 animate-spin'/>
                            Saving
                          </>
                        ) : (
                          "Save Notes"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : 

                  <>
                    {appointments.notes ? (
                      <p className='text-black dark:text-white whitespace-pre-line'>
                        {appointments.notes}
                      </p>
                    ) : (
                      <Alert className='text-center text-muted-foregroun italic border border-none bg-muted/50'>
                        <AlertDescription className='flex justify-center items-center text-sm gap-1 '>
                          <AlertCircle className='size-4'/>
                          Not notes avaialble
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                }
              </div>
            </div>
            <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-between'>
              {appointments.status === "SCHEDULED" || isAppointmentActive && (
                <Button
                  variant='destructive'
                  onClick={handleCancelAppointment}
                  disabled={cancelAppointmentLoading}
                  size='sm'
                >
                  {cancelAppointmentLoading ? (
                    <>
                      <Loader2 className='size-4 animate-spin'/>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className='size-4'/>
                      Cancel
                    </>
                  )}
                </Button>
              )}

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
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default AppointmentCard
