import PageHeader from '@/components/PageHeader'
import { Calendar } from 'lucide-react'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div className='container mx-auto py-8 px-4'>
      <PageHeader 
        title="My Appointments"
        icon={<Calendar/>}
        backLink='/doctors'
        backToPageLabel='Find Doctors'
      />
      {children}
    </div>
  )
}

export default layout
