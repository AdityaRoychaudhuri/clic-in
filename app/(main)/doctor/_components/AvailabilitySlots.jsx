"use client"
import { setDoctorAvailability } from '@/actions/doctor'
import useFetch from '@/hooks/useFetch'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleAlert, CircleAlertIcon, Clock, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { format } from 'date-fns'

const AvailabilitySlots = ({ slots }) => {
  const [showForm, setShowForm] = useState(false)

  const {
    data,
    loading,
    fetchData: submitSlotFn,
  } = useFetch(setDoctorAvailability)

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    }
  } = useForm({
    defaultValues: {
      startTime: "",
      endTime: ""
    }
  })

  const createLocalDateTime = (timeString) => {
    const [hours, minute] = timeString.split(":").map(Number);
    const now = new Date();

    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minute
    );

    return date;
  }

  const formatTimeString = (time) => {
    try {
      const formatted = format(new Date(time), "h:mm a");
      return formatted;
    } catch (error) {
      throw new Error("Failed to format string: "+error.message);
    }
  }

  const onSubmit = async (data) => {
    if (loading) {
      return;
    }

    const formData = new FormData();

    const startTime = createLocalDateTime(data.startTime);
    const endTime = createLocalDateTime(data.endTime);

    formData.append("startTime", startTime);
    formData.append("endTime", endTime);

    await submitSlotFn(formData);
  }

  useEffect(() => {
    if (data && data?.success) {
      toast.success("Availability time updated successfully!");
      setShowForm(false);
    }
  }, [data])
  

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-bold text-black dark:text-white items-center flex gap-2'>
          <Clock className='size-5 text-primary dark:text-green-600'/>
          Availability Settings
        </CardTitle>
        <CardDescription>
          Set your daily availability for patient appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <>
            <div>
              <h3 className='text-lg text-black dark:text-white font-medium mb-4'>
                Set Availavility
              </h3>

              {slots.length != 0 ? (
                <div>
                  {slots.map((slot) => {
                    return (
                      <div key={slot.id} className='flex items-center gap-2 py-4 p-3 rounded-md border border-accent mb-4 glass-card'>
                        <div className='bg-primary rounded-full p-2 '>
                          <Clock className='size-4 text-white'/>
                        </div>
                        <div>
                          <p className='font-medium text-black dark:text-white'>
                            {formatTimeString(slot.startTime)} - {formatTimeString(slot.endTime)}
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            Available
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className='text-muted-foreground'>
                  You haven&apos;t set any slots yet. Add your availability slots to 
                  start accepting appointments. 
                </p>
              )}
            </div>

            <Button
              onClick={() => setShowForm((prev) => !prev)}
              className='w-full'
            >
              <Plus className='size-4'/>
              Set Availability time
            </Button>

            <div className="mt-6 p-4 bg-muted/10 border border-white/5 rounded-md">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <CircleAlert className="h-4 w-4 mr-2 text-emerald-400" />
                How Availability Works
              </h4>
              <p className="text-muted-foreground text-sm">
                Setting your daily availability allows patients to book appointments
                during those hours. The same availability applies to all days. You
                can update your availability at any time, but existing booked
                appointments will not be affected.
              </p>
            </div>
          </>
        ) : (
          <form className='space-y-4 rounded-md p-4 border border-accent' onSubmit={handleSubmit(onSubmit)}>
            <h3 className='text-lg text-black dark:text-white font-medium mb-4'>
              Set Availavility
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <div className='space-y-4'>
                <Label htmlFor="startTime">
                  Start Time
                </Label>
                <Input 
                  id='startTime'
                  type='time'
                  {...register("startTime", {
                    required: "Start time is required"
                  })}
                  className='bg-background'
                />
                {errors.startTime && (
                  <p className='text-sm font-medium text-red-500'>
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className='space-y-4'>
                <Label htmlFor="endTime">
                  End Time
                </Label>
                <Input 
                  id='endTime'
                  type='time'
                  {...register("endTime", {
                    required: "End time is required"
                  })}
                  className='bg-background'
                />
                {errors.endTime && (
                  <p className='text-sm font-medium text-red-500'>
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className='flex gap-2 justify-end mt-2'>
              <Button
                variant='outline'
                onClick = {() => setShowForm(false)}
                disabled={loading}
                type='button'
                className='cursor-pointer border border-primary/20'
              >
                Cancel
              </Button>
              
              <Button
                type='submit'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='animate-spin size-4'/>
                    Submitting..
                  </>
                ) : (
                  <>
                    Submit availability
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted/10 border border-accent rounded-md">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <CircleAlert className="h-4 w-4 mr-2 text-emerald-400" />
                How Availability Works
              </h4>
              <p className="text-muted-foreground text-sm">
                Setting your daily availability allows patients to book appointments
                during those hours. The same availability applies to all days. You
                can update your availability at any time, but existing booked
                appointments will not be affected.
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default AvailabilitySlots
