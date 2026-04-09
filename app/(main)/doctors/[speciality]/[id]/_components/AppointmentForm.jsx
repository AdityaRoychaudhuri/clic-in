"use client"
import { bookAppointment } from '@/actions/appointments';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/useFetch';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, CreditCard, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const AppointmentForm = ({ doctorId, slot, onBack, onComplete }) => {
  const [description, setDescription] = useState("");

  const {
    data,
    error,
    fetchData: bookAppointmentFn,
    loading,
    setData
  } = useFetch(bookAppointment)

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("docId", doctorId);
    formData.append("startTime", slot.startTime);
    formData.append("endTime", slot.endTime);
    formData.append("patientDesc", description);

    await bookAppointmentFn(formData);
  };

  useEffect(() => {
    if (data && data.success) {
      toast.success("Appointment booked successfully!");
      onComplete();
    }
  }, [data])
  

  return (
    <form className='space-y-6' onSubmit={handleSubmit}>
      <div className='space-y-2 p-4 rounded-sm bg-primary/10 dark:bg-muted/20 border border-primary dark:border-accent'>
        <div className='flex items-center gap-2'>
          <Calendar className='size-4 text-green-700 dark:text-green-600'/>
          <span className='text-base font-semibold'>
            {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <Clock className='size-4 text-green-700 dark:text-green-600'/>
          <span className='text-base font-semibold'>
            {slot.formatted}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <CreditCard className='size-4 text-green-700 dark:text-green-600'/>
          <span className='text-base font-semibold'>
            Cost: 2 credits
          </span>
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor="desc" className='text-base font-semibold'>
          Describe your medical concern (optional)
        </Label>

        <Textarea
          id='desc'
          placeholder="Please provide all the details about your medical condition in depth....."
          className='h-32 max-h-44'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <p className='text-muted-foreground text-sm'>
          This information will be shared with the doctor before your appointment
        </p>
      </div>

      <div className='flex justify-between items-center pt-2'>
        <Button
          type="button"
          variant='outline'
          onClick={onBack}
          disabled={loading}
        >
          <ArrowLeft className='size-4'/>
          Change Time slot
        </Button>
        <Button
          type='submit'
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className='size-4 animate-spin'/>
              Booking...
            </>
          ) : (
            "Confirm appointment"
          )}
        </Button>
      </div>
    </form>
  )
}

export default AppointmentForm
