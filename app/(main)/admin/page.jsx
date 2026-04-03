import React from 'react'
import { TabsContent } from '@/components/ui/tabs'
import { getAllPendingDoctors, getAllVerifiedDoctors } from '@/actions/admin'
import PendingDoctors from './_components/PendingDoctors'
import VerifiedDoctors from './_components/VerifiedDoctors'

const page = async () => {
    const [pendingDoctorsData, verifiedDoctorsData] = await Promise.all([
        getAllPendingDoctors(),
        getAllVerifiedDoctors()
    ])

  return (
    <>
      <TabsContent value='pending'>
        <PendingDoctors data={pendingDoctorsData.doctors}/>
      </TabsContent>
      <TabsContent value='doctors'>
        <VerifiedDoctors data={verifiedDoctorsData.doctors}/>
      </TabsContent>
    </>
  )
}

export default page
