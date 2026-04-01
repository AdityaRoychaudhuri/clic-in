import { checkUser } from '@/lib/checkUser'
import { redirect } from 'next/navigation';
import React from 'react'

const layout = async ({ children }) => {
    const user = await checkUser();

    if (user) {
        if (user.role === "PATIENT") {
            redirect("/doctors");
        } else if (user.role === "DOCTOR") {
            if (user.verificationStatus === "VERIFIED") {
                redirect("/doctor");
            } else{
                redirect("/doctor/verification");
            }
        } else if (user.role === "ADMIN") {
            redirect("/admin");
        }
    }

  return (
    <div className='container px-4 py-12 mx-auto'>
        <div className='max-w-5xl mx-auto'>
            <div className='mb-18 text-center'>
                <h1 className='gradient-title text-4xl md:text-5xl font-bold mb-4'>
                    Welcome to Clic-in
                </h1>
                <p className='text-muted-foreground text-lg'>
                    Tell us how you want to use the platform 
                </p>
            </div>
            {children}
        </div>
    </div>
  )
}

export default layout