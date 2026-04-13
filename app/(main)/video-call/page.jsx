import React from 'react'
import VideoCall from './_components/VideoCall';

const page = async ({ searchParams }) => {
  const { sessionId, token } = await searchParams;
  
  return (
    <VideoCall sessionId token/>
  )
}

export default page
