"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { doctorFormSchema } from '@/lib/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, User } from 'lucide-react';

const page = () => {
  const [step, setStep] = useState("first-step");

  const {
    register,
    watch,
    handleSubmit,
    formState: {
      errors
    },
    setValue
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      specaility: "",
      experience: undefined,
      credentialUrl: "",
      description: ""
    }
  })

  if (step === "first-step") {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

        <Card className="border glass-card border-green-700/10 hover:shadow-primary cursor-pointer transition-all">
          <CardContent className='pt-9 flex items-center text-center flex-col'>
            <div className='p-4 mb-4 bg-primary/10 dark:bg-primary/55 rounded-full'>
              <User className='size-8 text-primary dark:text-green-600'/>
            </div>
            <CardTitle className='text-xl font-semibold text-black dark:text-white mb-4'>
              Join as a patient
            </CardTitle>
            <CardDescription className=''>
              Book appointments. consult with doctors, and manage your healthcare journey
            </CardDescription>
            <Button className='text-base bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-4'>
              Continue as a patient
            </Button>
          </CardContent>
        </Card>

        <Card className="border glass-card border-green-700/10 hover:shadow-primary cursor-pointer transition-all">
          <CardContent className='pt-9 flex items-center text-center flex-col'>
            <div className='p-4 mb-4 bg-primary/10 dark:bg-primary/55 rounded-full'>
              <Stethoscope className='size-8 text-primary dark:text-green-600'/>
            </div>
            <CardTitle className='text-xl font-semibold text-black dark:text-white mb-4'>
              Join as a doctor
            </CardTitle>
            <CardDescription className=''>
              Create your professional profile, set your availability, and provide consultations.
            </CardDescription>
            <Button className='text-base bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-4'>
              Continue as a doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "second-step") {
    return (
      <>
        
      </>
    )
  }
}

export default page