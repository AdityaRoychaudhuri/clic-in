import PageHeader from '@/components/PageHeader'
import { Stethoscope } from 'lucide-react'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <PageHeader icon={<Stethoscope/>} title={"Doctor Dashboard"}/>
      {children}
    </div>
  )
}

export default layout
