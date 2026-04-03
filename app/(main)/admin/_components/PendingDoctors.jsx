"use client"
import { verifyDoctorStatus } from '@/actions/admin';
import useFetch from '@/hooks/useFetch';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, ExternalLink, FileText, Loader2, Medal, User, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

const PendingDoctors = ({ data: doctorData }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [action, setAction] = useState("");

  const {
      data: serverData,
      error,
      fetchData: submitDoctorStatus,
      loading,
      setData
  } = useFetch(verifyDoctorStatus);

  const handleVerifyDoctorStatus = async (doctorId, status) => {
    if (loading) {
      return;
    }

    const formData = new FormData();

    formData.append("doctorId", doctorId);
    formData.append("status", status);

    setAction(status);

    await submitDoctorStatus(formData);
  }

  const handleOpenDialog = (doctor) => {
    setSelectedDoctor(doctor);
  }

  const handleCloseDialog = () => {
    setSelectedDoctor(null);
    setAction("");
  }

  useEffect(() => {
    if (serverData && serverData?.success) {
      if (action === "VERIFIED") {
        toast.success(`Successfully ${action} ${selectedDoctor.name}`);
      } else {
        toast.error(`${action} ${selectedDoctor.name}`);
      }
      handleCloseDialog();
      
    }
  }, [serverData])
  

  return (
    <div>
      <Card>
        <CardHeader className='space-y-2'>
          <CardTitle className='text-xl font-bold text-black dark:text-white'>
            Pending Doctor Verifications
          </CardTitle>
          <CardDescription>Review and approve doctor applications</CardDescription>
        </CardHeader>
        <CardContent>
          {doctorData.length === 0 ? (
            <div className='text-center text-muted-foreground py-8'>
              No pending Verification requests
            </div>
          ) : (
            <div className='space-y-4'>
              {doctorData.map((doctor) => (
                <Card 
                  key={doctor.id}
                  className='bg-background/60 border border-primary/20 hover:border-primary/40 transition-all'
                >
                  <CardContent className='p-4'>
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                      <div className='flex gap-4'>
                        <div className='rounded-full bg-primary/10 dark:bg-primary/25 p-3'>
                          <User className='size-5 text-primary dark:text-green-600'/>
                        </div>
                        <div className='flex flex-col items-start justify-center'>
                          <h3 className='font-medium'>
                            {doctor.name}
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            {doctor.speciality} • {doctor.experience} years of experience
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center self-end md:self-auto gap-2'>
                        <Badge
                          variant='outline'
                          className='bg-amber-900/20 border-amber-900/30 text-amber-500 rounded-xs py-2'
                        >
                          Pending
                        </Badge>
                        <Button
                          variant='outline'
                          size='sm'
                          className='bg-primary hover:bg-primary/75 cursor-pointer'
                          onClick = {() => (handleOpenDialog(doctor))}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg md:max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle className='text-xl text-black font-bold dark:text-white'>
              Doctor Verification Details
            </DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>
              Review the doctors&apos;s information carefully before making a decision
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-6 py-4'>
            <div  className='flex gap-6 md:px-2'>
              <div className='flex-1 space-y-1 md:text-center'>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Full Name
                </h4>
                <p className='font-bold text-base text-black dark:text-white'>
                  {selectedDoctor?.name}
                </p>
              </div>
              <div className='flex-1 space-y-1 md:text-center'>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Email
                </h4>
                <p className='font-bold text-base text-black dark:text-white'>
                  {selectedDoctor?.email}
                </p>
              </div>
              <div className='flex-1 space-y-1 md:text-center'>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Application Date
                </h4>
                <p className='font-bold text-base text-black dark:text-white'>
                  {format(new Date(selectedDoctor?.createdAt), "PPP")}
                </p>
              </div>
            </div>

            <Separator className='bg-green-700/45'/>

            <div className='space-y-4'>
              <div className='flex gap-1 items-center mb-5'>
                <Medal className='size-5 text-green-500'/>
                <h1 className='font-bold text-base text-black dark:text-white'>Professional Information</h1>
              </div>
              <div className='grid grid-cols-2'>
                <div className='space-y-1'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Speciality
                  </h4>
                  <p className='font-bold text-base text-black dark:text-white'>
                    {selectedDoctor.speciality}
                  </p>
                </div>
                <div className='space-y-1'>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Years of Experience
                  </h4>
                  <p className='font-bold text-base text-black dark:text-white'>
                    {selectedDoctor.experience} years
                  </p>
                </div>
              </div>

              <div className='space-y-1 col-span-2'>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Credentials
                </h4>
                <a 
                  href={selectedDoctor.credentialUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-green-500 hover:text-green-300 flex items-center w-fit font-bold text-base'  
                >
                  View Credentials
                  <ExternalLink className='size-4 ml-1'/>
                </a>
              </div>
            </div>

            <Separator className='bg-green-700/45'/>

            <div className='space-y-2'>
              <div className='flex gap-1 items-center mb-4'>
                <FileText className='size-5 text-green-500'/>
                <h1 className='font-bold text-base text-black dark:text-white'>Professional Information</h1>
              </div>
              <p className='text-sm font-medium text-muted-foreground whitespace-pre-line'>
                {selectedDoctor.description}
              </p>
            </div>

            {loading && (
              <BarLoader width={"100%"} color='#0D9E03'/>
            )}
          </div>
          <DialogFooter className='flex sm:justify-between'>
            <Button
              variant='destructive'
              disabled={loading}
              className='bg-red-600 hover:bg-red-700'
              onClick = {() => handleVerifyDoctorStatus(selectedDoctor.id, "REJECTED")}
            >
              <X className='size-4'/>
              Reject
            </Button>
            <Button
              disabled={loading}
              className='bg-green-600 hover:bg-green-700'
              onClick = {() => handleVerifyDoctorStatus(selectedDoctor.id, "VERIFIED")}
            >
              <Check className='size-4'/>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  )
}

export default PendingDoctors
