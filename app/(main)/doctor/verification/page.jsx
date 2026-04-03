import { getUserInfo } from '@/actions/onboarding';
import { redirect } from 'next/navigation';
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ClipboardClock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


const page = async () => {
    const user = await getUserInfo();

    if (user?.verificationStatus === "VERIFIED") {
        redirect("/doctor")
    }

    const isRejected = user?.verificationStatus === "REJECTED";

  return (
    <div className='container mx-auto px-4 py-12'>
        <div className='max-w-2xl mx-auto'>
            <Card className='dark:bg-transparent border border-border hover:border-primary/40'>
                <CardHeader className='text-center'>
                    <div className={`mx-auto p-4 ${isRejected ? 'bg-red-9000/20' : 'bg-amber-900/20'} rounded-full mb-4 w-fit`}>
                        {isRejected ? (
                            <XCircle className='size-8 text-red-500'/>
                        ) : (
                            <ClipboardClock className='size-8 text-amber-500'/>
                        )}
                    </div>
                    <CardTitle className='text-2xl font-bold text-black dark:text-white'>
                        {isRejected ? (
                            "Verification declined"
                        ) : (
                            "Verification Inprogress"
                        )}
                    </CardTitle>
                    <CardDescription className='text-lg'>
                        {isRejected ? (
                            "Unfortunately, your application is rejected and needs further revision"
                        ) : (
                            "Your application is currently queued for verification"
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                    {isRejected ? (
                        <div className='bg-red-900/10 border border-red-900/20 rounded-lg flex p-4 items-start mb-6'>
                            <AlertCircle className='size-5 text-red-500 mr-2 mt-0.5 shrink-0'/>
                            <div className='text-muted-foreground text-left'>
                                <p className='mb-2'>
                                    Our administrative team has reviewed your application and
                                    found that it doesn&apos;t meet our current requirements.
                                    Common reasons for rejection include:
                                </p>
                                <ul className='list-disc space-y-1 mb-3 pl-5'>
                                    <li>Insufficient or unclear credential documentation</li>
                                    <li>Professional experience requirements not met</li>
                                    <li>Incomplete or vague service description</li>
                                </ul>
                                <p>
                                    You can update your application with more information and
                                    resubmit for review.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-amber-900/10 border border-amber-900/20 rounded-lg flex p-4 mb-6'>
                            <AlertCircle className='size-5 text-amber-500 mr-2 mt-0.5 shrink-0'/>
                            <div className='text-muted-foreground text-left'>
                                <p>
                                    Your profile is currently under review by our administrative
                                    team. This process typically takes 1-2 business days.
                                    You&apos;ll receive an email notification once your account is
                                    verified.
                                </p>
                            </div>
                        </div>
                    )}
                    <p className='text-muted-foreground/70 mb-4 text-left'>
                        {isRejected ? (
                            "You can update your doctor profile and resubmit for verification."
                        ) : (
                            "While you wait, you can familiarize yourself with our platform or reach out to our support team if you have any questions"
                        )}
                    </p>

                    <div className='flex flex-col md:flex-row gap-4 justify-center'>
                        {isRejected ? (
                            <>
                                <Button
                                    asChild
                                    variant="outline"
                                >
                                    <Link href='/'>
                                        Back to Home
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                >
                                    <Link href='/doctor/update-profile'>
                                        Update Profile
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    asChild
                                    variant="outline"
                                >
                                    <Link href='/'>
                                        Back to Home
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-primary hover:bg-primary/75"
                                >
                                    <Link href='/contact-support'>
                                        Contact Support
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>

            </Card>
        </div>
    </div>
  )
}

export default page
