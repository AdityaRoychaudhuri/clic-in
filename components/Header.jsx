import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from '@/components/ui/button'
import ThemeToggle from './ThemeToggle'
import { checkUser } from '@/lib/checkUser'
import { Calendar, ShieldCheck, Stethoscope, User } from 'lucide-react'

const Header = async () => {
    const user = await checkUser();

  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-backdrop-filter:bg-background/60'>
        <nav className='container mx-auto px-4 md:px-2 h-16 flex items-center justify-between'>
            <Link href="/">
                <Image
                    src="/logo-single.png"
                    alt='Clic-in Logo'
                    width={200}
                    height={60}
                    className='h-10 w-auto object-contain'
                />
            </Link>

            <div className='flex items-center space-x-4'>
                <Show when='signed-in'>
                    {user?.role === "ADMIN" && (
                        <Link href="/admin">
                            <Button className='cursor-pointer hidden md:inline-flex items-center' variant='outline'>
                                <ShieldCheck className='size-4'/>
                                Admin Dashboard
                            </Button>
                            <Button variant='outline' className='md:hidden size-10 p-0'>
                                <ShieldCheck className='size-4'/>
                            </Button>
                        </Link>
                    )}

                    {user?.role === "DOCTOR" && (
                        <Link href="/doctor">
                            <Button className='cursor-pointer hidden md:inline-flex items-center' variant='outline'>
                                <Stethoscope className='size-4'/>
                                My Appointments
                            </Button>
                            <Button variant='outline' className='md:hidden size-10 p-0'>
                                <Stethoscope className='size-4'/>
                            </Button>
                        </Link>
                    )}
                    
                    {user?.role === "PATIENT" && (
                        <Link href="/appointments">
                            <Button className='cursor-pointer hidden md:inline-flex items-center' variant='outline'>
                                <Calendar className='size-4'/>
                                My Appointments
                            </Button>
                            <Button variant='outline' className='md:hidden size-10 p-0'>
                                <Calendar className='size-4'/>
                            </Button>
                        </Link>
                    )}
                    
                    {user?.role === "UNASSIGNED" && (
                        <Link href="/onboarding">
                            <Button className='cursor-pointer hidden md:inline-flex items-center' variant='outline'>
                                <User className='size-4'/>
                                Complete Profile
                            </Button>
                            <Button variant='outline' className='md:hidden size-10 p-0'>
                                <User className='size-4'/>
                            </Button>
                        </Link>
                    )}
                </Show>

                <Show when="signed-out">
                    <SignInButton>
                        <Button variant='secondary'>
                            Sign In
                        </Button>
                    </SignInButton>
                </Show>
                <Show when="signed-in">
                    <ThemeToggle iconSize={20}/>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "scale-125",
                                userButtonPopoverCard: "shadow-xl",
                                userPreviewMainIdentifier: "font-semibold"
                            }
                        }}
                    />
                </Show>
            </div>
        </nav>
    </header>
  )
}

export default Header