import { verifyAdmin } from '@/actions/admin'
import PageHeader from '@/components/PageHeader'
import { AlertCircle, ShieldUser, Users, Users2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const layout = async ({ children }) => {
    const isAdmin = await verifyAdmin();

    if (!isAdmin) {
        redirect("/onboarding");
    }
  return (
    <div className='container mx-auto px-4 py-8'>
      <PageHeader icon={<ShieldUser/>} title={"Admin Settings"}/>
      <Tabs 
        defaultValue="pending" 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        orientation='vertical'
      >
        <TabsList
            className='md:col-span-1 h-14 md:h-28 w-full rounded-md bg-muted/45 flex sm:flex-row md:flex-col p-2 sm:p-1 space-y-2 md:space-y-1 sm:space-x-2 md:space-x-0'
        >
            <TabsTrigger 
                value="pending"
                className='p-2 flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full'
            >
                <AlertCircle className='size-4 hidden md:inline'/>
                <span>Pending Verification</span>
            </TabsTrigger>
            <TabsTrigger 
                value="doctors"
                className='p-2 flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full'
            >
                <Users2 className='size-4 hidden md:inline'/>
                <span>Doctors</span>
            </TabsTrigger>
            <TabsTrigger 
                value="doctors"
                className='p-2 flex-1 md:flex md:items-center md:justify-start md:px-4 md:py-3 w-full'
            >
                <Users2 className='size-4 hidden md:inline'/>
                <span>Doctors</span>
            </TabsTrigger>
        </TabsList>
        <div className='md:col-span-3'>
            { children }
        </div>
      </Tabs>
    </div>
  )
}

export default layout
