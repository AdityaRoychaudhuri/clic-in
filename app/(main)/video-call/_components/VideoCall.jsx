"use client"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React, { useRef, useState } from 'react'
import { toast } from 'sonner';

const VideoCall = ({ sessionId, token }) => {
  console.log(sessionId);
  console.log(token)
  const [isLoading, setIsLoading] = useState(true);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  const vonageSessionObjectRef = useRef(null);
  const publisherRef = useRef(null);   // Storing if our video is on or off, audio is on or off, if we have left the call....
  const router = useRouter();

  const vonageApplicationId = process.env.NEXT_PUBLIC_VONAGE_VID_CALL_KEY;

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);

    if (!window.OT) {
      toast.error("Failed to load Vonage API");
      setIsLoading(false);
      return;
    }

    initializeFunction();
  }

  const initializeFunction = () => {}

  if (!vonageApplicationId || !token || !sessionId) {
    return (
      <div className='container mx-auto px-4 py-54 text-center'>
        <h1 className='text-6xl font-bold text-black dark:text-white mb-4 gradient-title'>
          Invalid Video Call
        </h1>
        <p className='text-muted-foreground mb-6 text-lg'>
          Missing required parameters for the video call.
        </p>
        <Button
          onClick={() => router.push("/appointments")}
        >
          Back to Appointments
        </Button>
      </div>
    )
  }

  return (
    <Script
      src="https://video.standard.vonage.com/v2/js/opentok.min.js"
      onLoad={handleScriptLoad}
      onError={() => {
        toast.error("Failed to load video call script");
        setIsLoading(false);
      }}
    />
  )
}

export default VideoCall
