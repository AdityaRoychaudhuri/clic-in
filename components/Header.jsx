import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import { Button } from '@/components/ui/button'
import ThemeToggle from './ThemeToggle'
import { checkUser } from '@/lib/checkUser'
import { Calendar, CreditCard, ShieldCheck, Stethoscope, User } from 'lucide-react'
import { checkCredits } from '@/actions/credits'
import { Badge } from './ui/badge'

const Header = async () => {
    const user = await checkUser();
    if (user?.role === "PATIENT") {
        await checkCredits(user);
    }

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
                        <Link href="/doctors">
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

               {(!user || user?.role !== "ADMIN") && (
                <Link href={user?.role === "PATIENT" ? "/pricing" : "/doctor"}>
                    <Button
                        variant="outline"
                        className="h-9 bg-primary/10 border-primary/30 dark:bg-primary/30 dark:border-primary/80 px-3 py-1 flex items-center gap-2"
                    >
                        <CreditCard className="size-4 text-green-700 dark:text-chart-1" />
                        <span className="text-green-700 font-bold text-[14px] dark:text-chart-1">
                            {user && user.role !== "ADMIN" ? (
                                <>
                                    {user.credit}{" "}
                                    <span className="hidden md:inline">
                                        {user?.role === "PATIENT"
                                        ? "Credits"
                                        : "Earned Credits"}
                                    </span>
                                </>
                            ) : (
                                <>Pricing</>
                            )}
                        </span>
                    </Button>
                </Link>
            )}

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