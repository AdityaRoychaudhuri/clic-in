"use client"
import React, { useEffect, useState } from 'react'
import useFetch from '@/hooks/useFetch';
import { updateDoctorStatus } from '@/actions/admin';
import { Input } from '@/components/ui/input';
import { Ban, Loader2, Search, Trash2Icon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogMedia } from '@/components/ui/alert-dialog';

const VerifiedDoctors = ({ data: doctorData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetedDoctor, setTargetedDoctor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(false);

  const {
    data,
    error,
    fetchData: updateDoctorStatusFn,
    loading,
    setData
  } = useFetch(updateDoctorStatus);

  const filteredDoctos = doctorData.filter((doctor) => {
    const query = searchTerm.toLowerCase();

    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query) ||
      doctor.speciality.toLowerCase().includes(query)
    )
  })

  const handleOpenAlertDialogue = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenDialogue(true);
  }

  const handleCloseAlertDialogue = () => {
    setSelectedDoctor(null);
    setOpenDialogue(false);
  }

  const handleStatusSuspend = async (doctor) => {
    if (loading) {
      return;
    }

    const formData = new FormData();
    formData.append("doctorId", doctor.id);
    formData.append("status", "suspend");

    setTargetedDoctor(doctor);

    await updateDoctorStatusFn(formData);
  }

  useEffect(() => {
    if (data?.success) {
      toast.success(`Suspended ${targetedDoctor.name} successfully`);
      setTargetedDoctor(null);
      handleCloseAlertDialogue();
    }
  }, [data])
  

  return (
    <div>
      <Card className='bg-muted/50'>
        <CardHeader>
          <div className='flex flex-col-reverse md:flex-row  gap-4 justify-between'>
            <div className='space-y-1'>
              <CardTitle className='text-xl font-bold text-black dark:text-white'>
                Manage Doctors
              </CardTitle>
              <CardDescription>
                View and Manage all verified doctors
              </CardDescription>
            </div>
            <div className='relative w-full md:w-64'>
              <Search className='absolute size-4 text-muted-foreground top-2.5 left-2.5'/>
              <Input
                placeholder='Search'
                className='pl-8 bg-background'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDoctos.length === 0 ? (
            <div>
              {searchTerm ? (
                "There are no records that match the criteria"
              ) : (
                "No verified doctors available"
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredDoctos.map((doctor) => (
                <Card 
                  key={doctor.id}
                  className='bg-background/60 border border-primary/20 hover:border-primary/40 transition-all'
                >
                  <CardContent className=''>
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
                          className='bg-green-900/20 border-green-900/30 text-green-500 rounded-xs py-2'
                        >
                          Active
                        </Badge>
                        <Button
                          disabled={loading}
                          variant='destructive'
                          size='sm'
                          className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive cursor-pointer'
                          onClick = {() => handleOpenAlertDialogue(doctor)}
                        >
                          {loading && targetedDoctor?.id === doctor.id ? (
                            <>
                              <Loader2 className='size-4 animate-spin'/>
                              Suspending...
                            </>
                          ) : (
                            <>
                              <Ban className='size-4'/>
                              Suspend
                            </>
                          )}
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
        <AlertDialog open={openDialogue} onOpenChange={handleCloseAlertDialogue}>
          <AlertDialogContent size="sm" className='bg-background'>
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive ">
                <Ban size='xl'/>
              </AlertDialogMedia>
              <AlertDialogTitle>Suspend Doctor</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to suspend{" "}
                <span className="font-semibold">
                  {selectedDoctor?.name}
                </span> ?<br/> This action can be reversed later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => handleStatusSuspend(selectedDoctor)}>Suspend</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

export default VerifiedDoctors
