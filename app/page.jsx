import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div>
        <div className='h-screen font-heading flex flex-col justify-center items-center gap-4'>
            <h1 className='text-6xl font-mono'>
                Hello
            </h1>
            <Button className='text-lg'>
                Click me
            </Button>
            <p className='text-muted-foreground max-w-xl px-2'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quod numquam corrupti similique iure fugiat modi ea minima debitis corporis? Amet modi libero perferendis praesentium assumenda nisi neque. Iure, quaerat!
                adasdaddawdwd
            </p>
        </div>
    </div>
    
  )
}

export default page