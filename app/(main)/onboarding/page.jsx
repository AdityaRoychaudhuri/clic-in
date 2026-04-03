"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { doctorFormSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Loader2, Stethoscope, User } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { setUserRole } from '@/actions/onboarding';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SPECIALTIES } from '@/lib/specialities';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';


const page = () => {
  const [step, setStep] = useState("first-step");

  const router = useRouter();

  const { data, fetchData: submitUserRole, loading, error } = useFetch(setUserRole);

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

  const specialityValue = watch("speciality");

  const handlePatientSelection = async () => {
    if (loading) {
      return;
    }

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData);
  }

  useEffect(() => {
    if (data && data.success) {
      toast.success("Role Selected!");
      router.push(data.redirect)
    }
  }, [data])

  const doctorDetailsSubmit = async (data) => {
    if (loading) return;
    
    const formData = new FormData();

    formData.append("speciality", data.speciality);
    formData.append("description", data.description);
    formData.append("experience", data.experience);
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("role", "DOCTOR");

    await submitUserRole(formData);
  }
  

  if (step === "first-step") {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

        <Card className="border glass-card border-green-700/10 hover:shadow-primary transition-all">
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
            <Button 
              disabled={loading} 
              className='text-base bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer w-full mt-4'
              onClick = {handlePatientSelection}
            >
              {loading ? (
                <>
                  <Loader2 className='animate-spin size-4 mr-2'/>
                  Processing...
                </>
              ) : (
                <>
                  Continue as a patient
                </>
              )}
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
            <Button 
              className='text-base bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer w-full mt-4'
              onClick = {() => setStep("second-step")} 
              disabled={loading}
            >
              Continue as a doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "second-step") {
    return (
      <Card>
        <CardContent className=''>
          <div className='mb-6'>
            <CardTitle className='text-3xl font-bold text-black dark:text-white mb-2'>
              Join as a doctor
            </CardTitle>
            <CardDescription>
              Please provide your professional details for verification
            </CardDescription>
          </div>

          <form 
            className='space-y-6'
            onSubmit={handleSubmit(doctorDetailsSubmit)}
          >
            <div className='space-y-2'>
              <Label htmlFor='speciality'>
                Medical Speciality
              </Label>
              <Select
                value={specialityValue}
                onValueChange={(value) => setValue("speciality", value)}
              >
                <SelectTrigger id="speciality">
                  <SelectValue placeholder="Select a speciality" />
                </SelectTrigger>

                <SelectContent>
                  {SPECIALTIES.map((item) => (
                    <SelectItem key={item.name} value={item.name} className="flex items-center gap-2">
                        <span className='text-green-700'>{item.icon}</span>
                        {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specaility && (
                <p className='text-sm text-red-500 mt-1 font-medium'>
                  {errors.specaility.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='experience'>
                Years of Experience
              </Label>
              <Input 
                id='experience' 
                type='number' 
                placeholder='e.g 5'
                {...register("experience", {valueAsNumber: true})}  
              />
              {errors.experience && (
                <p className='text-sm text-red-500 mt-1 font-medium'>
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='credentialUrl'>
                Years of Experience
              </Label>
              <Input 
                id='credentialUrl' 
                type='url'
                placeholder='https://example.com/my-medico-degree.pdf'
                {...register("credentialUrl")}  
              />
              {errors.credentialUrl && (
                <p className='text-sm text-red-500 mt-1 font-medium'>
                  {errors.credentialUrl.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>
                Description of your services
              </Label>
              <Textarea
                id="description"
                placeholder="Give a professional description of your services, expertise and approach..."
                rows="6"
                {...register("description")}
                className='h-full'
              />
              {errors.description && (
                <p className='text-sm text-red-500 mt-1 font-medium'>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setStep("first-step")}
                disabled={loading}
              >
                Go back
              </Button>
              <Button
                type='submit'
                className='text-base bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='size-4 animate-spin'/>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }
}

export default page