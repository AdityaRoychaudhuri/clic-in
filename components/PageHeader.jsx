import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft } from 'lucide-react'

const PageHeader = ({ icon, title, backLink="/", backToPageLabel="Back to Home" }) => {
  return (
    <div className='flex flex-col justify-between gap-5 mb-8'>
      <Link href={backLink} className='w-fit'>
        <Button
            variant='outline'
            size='sm'
            className='mb-2'
        >
            <ArrowLeft className='size-4'/>
            {backToPageLabel}
        </Button>
      </Link>

      <div className='flex items-center gap-2'>
        {icon && (
            <div className='text-green-700'>
                {React.cloneElement(icon, {
                    className: 'size-12 md:size-14'
                })}
            </div>
        )}
        <h1 className='text-4xl md:text-6xl gradient-title'>
            {title}
        </h1>
      </div>
    </div>
  )
}

export default PageHeader
