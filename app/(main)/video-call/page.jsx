import React from 'react'
import VideoCall from './_components/VideoCall';

const page = async ({ searchParams }) => {
  const { sessionId, token } = await searchParams;
  
  return (
    <VideoCall sessionId={sessionId} token={token}/>
  )
}

export default page
