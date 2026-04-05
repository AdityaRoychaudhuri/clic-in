"use client"
import { setDoctorAvailability } from '@/actions/doctor'
import useFetch from '@/hooks/useFetch'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl font-bold text-black dark:text-white items-center flex gap-2'>
          <Clock className='size-5'/>
          Availability Settings
        </CardTitle>
        <CardDescription>
          Set your daily availability for patient appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  )
}

export default AvailabilitySlots
