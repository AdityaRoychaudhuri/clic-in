import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Show, SignInButton, SignOutButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-backdrop-filter:bg-background/60'>
        <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
            <Link href="/">
                <Image
                    src="/logo-single.png"
                    alt='Clic-in Logo'
                    width={200}
                    height={60}
                    className='h-10 w-auto object-contain'
                />
            </Link>

            <div className='flex items-center space-x-2'>
                <Show when="signed-out">
                    <SignInButton>
                        <Button variant='secondary'>
                            Sign In
                        </Button>
                    </SignInButton>
                </Show>
                <Show when="signed-in">
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