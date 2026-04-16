import React from 'react'
import { TabsContent } from '@/components/ui/tabs'
import { approvePayout, getAllPendingDoctors, getAllVerifiedDoctors, getPendingPayouts } from '@/actions/admin'
import PendingDoctors from './_components/PendingDoctors'
import VerifiedDoctors from './_components/VerifiedDoctors'
import PendingPayouts from './_components/PendingPayouts'

const page = async () => {
    const [pendingDoctorsData, verifiedDoctorsData, pendingPayouts, approvePayouts] = await Promise.all([
        getAllPendingDoctors(),
        getAllVerifiedDoctors(),
        getPendingPayouts(),
        approvePayout()
    ])

  return (
    <>
      <TabsContent value='pending'>
        <PendingDoctors data={pendingDoctorsData.doctors}/>
      </TabsContent>
      <TabsContent value='doctors'>
        <VerifiedDoctors data={verifiedDoctorsData.doctors}/>
      </TabsContent>
      <TabsContent>
        <PendingPayouts/>
      </TabsContent>
    </>
  )
}

export default page
