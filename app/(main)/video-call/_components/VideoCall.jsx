"use client"
import { Button } from '@/components/ui/button';
import { Loader2, Mic, MicOff, PhoneOff, User, Video, VideoOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';

const VideoCall = ({ sessionId, token }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
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

  const initializeFunction = () => {
    if (!vonageApplicationId || !token || !sessionId) {
      toast.error("Missing required parameters for the video call.");
      router.push("/appointments");
    }

    try {
      vonageSessionObjectRef.current = window.OT.initSession(vonageApplicationId, sessionId);

      vonageSessionObjectRef.current.on("streamCreated", (e) => {
        vonageSessionObjectRef.current.subscribe(e.stream, "subscriber-div", {
          insertMode: "append",
          width: "100%",
          height: "100%",
        }, (error) => {
          if (error) {
            toast.error("Error connecting to other participant's stream");
          }
        });
      });

      vonageSessionObjectRef.current.on("sessionConnected",  () => {
        setIsConnected(true);
        setIsLoading(false);

        publisherRef.current = window.OT.initPublisher("publisherId", {
          insertMode: "replace",
          width: "100%",
          height: "100%",
          publishAudio: audio,
          publishVideo: video
        }, (error) => {
          if (error) {
            console.error("Publisher error: "+error);
            toast.error("Error initializing your camera and microphone");
          } else {
            console.log("Publisher initialized successfully - you can see your video now");
          }
        });
      });

      vonageSessionObjectRef.current.on("sessionDisconnected", () => {
        setIsConnected(false);
      });

      vonageSessionObjectRef.current.connect(token, (error) => {
        if (error) {
          console.error(error)
          toast.error("Trouble connecting to the video stream");
        } else {
          if (publisherRef.current) {
            vonageSessionObjectRef.current.publish(publisherRef.current, (error) => {
              if (error) {
                console.error("Error publishing string: "+error);
                toast.error("Error publishing your stream");
              } else {
                console.log("Stream published successfully");
              }
            });
          }
        }
      });
    } catch (error) {
      console.error("Error in initializeFunction: "+error.message);
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  }

  const toggleVideo = () => {
    if (publisherRef) {
      publisherRef.current.publishVideo(!video);
      setVideo((prev) => !prev);
    }
  }

  const toggleAudio = () => {
    if (publisherRef) {
      publisherRef.current.publishAudio(!audio);
      setAudio((prev) => !prev);
    }
  }

  const endCall = () => {
    if (publisherRef.current) {
      publisherRef.current.destroy();
      publisherRef.current = null;
    }

    if (vonageSessionObjectRef.current) {
      vonageSessionObjectRef.current.disconnect();
      vonageSessionObjectRef.current = null;
    }

    router.push("/appointments");
  }

  useEffect(() => {
    return () => {
      if (publisherRef.current) {
        publisherRef.current.destroy();
      }

      if (vonageSessionObjectRef.current) {
        vonageSessionObjectRef.current.disconnect();
      }
    }
  }, []);
  

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
    <>
      <Script
        src="https://video.standard.vonage.com/v2/js/opentok.min.js"
        onLoad={handleScriptLoad}
        onError={() => {
          toast.error("Failed to load video call script");
          setIsLoading(false);
        }}
      />

      <div className='container mx-auto px-4 py-8'>
        <div className='text-center mb-6'>
          <h1 className='text-4xl text-black dark:text-white font-bold mb-2 '>
            Video Consultation
          </h1>
          <p className='text-muted-foreground'>
            {isConnected ? 
              "Connected" 
              : isLoading
              ? "Connecting..."
              : "Connection failed"
            }
          </p>
        </div>

        {isLoading && !isScriptLoaded ? (
          <div className='flex flex-col items-center justify-center py-32 text-muted-foreground gap-2'>
            {/* Will show that video call is loading */}
            <Loader2 className='animate-spin h-12 w-12'/>
            <p className='text-lg text-black dark:text-white'>
              Loading video call components...
            </p>
          </div>
        ) : (
          <div className='space-y-6'>
            {/* will show all the components */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
              <div className='border border-green-900/40 rounded-lg overflow-hidden'>
                <div className='px-3 py-2 text-green-700 dark:text-green-600 text-sm font-medium'>
                  You
                </div>

                <div
                  id='publisherId'
                  className='w-full aspect-video bg-muted/30'
                >
                  {!isScriptLoaded && (
                    <div className='flex items-center justify-center h-full'>
                      <div className='bg-muted/20 rounded-full p-8'>
                        <User className='h-12 w-12 text-green-700 dark:text-green-500'/>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className='border border-green-900/40 rounded-lg overflow-hidden'>
                <div className='px-3 py-2 text-green-700 dark:text-green-600 text-sm font-medium'>
                  Other participant
                </div>

                <div id='subscriber-div' className='w-full aspect-video bg-muted/30'>
                  {(!isConnected || !isScriptLoaded) && (
                    <div className='flex items-center justify-center h-full'>
                      <div className='bg-muted/20 rounded-full p-8'>
                        <User className='h-12 w-12 text-green-700 dark:text-green-500'/>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='flex justify-center space-x-4 mb-8'>
              <Button
                variant='outline'
                size='lg'
                onClick={toggleVideo}
                className={`p-4 h-18 w-18 rounded-full ${video ? "border-green-900/20" : "bg-red-900/20 border-red-900/30 text-red-400"}`}
                disabled={!publisherRef.current}
              >
                {video ? <Video className='size-6'/> : <VideoOff className='size-6'/>}
              </Button>

              <Button
                size='lg'
                variant='outline'
                onClick={toggleAudio}
                className={`p-4 h-18 w-18 rounded-full ${audio ? "border-green-900/20" : "bg-red-900/20 border-red-900/30 text-red-400"} hover:bg-transparent hover:text-inherit`}
                disabled={!publisherRef.current}
              >
                {audio ? <Mic className='size-6'/> : <MicOff className='size-6'/>}
              </Button>

              <Button
                variant='desctructive'
                size='lg'
                onClick={endCall}
                className="rounded-full p-4 h-18 w-18 bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className='size-6'/>
              </Button>
            </div>

            <div className='text-center mt-8'>
              <div className='text-sm text-muted-foreground space-x-2 flex items-center justify-center'>
                <p>
                  {video ? "Video on" : "Video off"}
                </p>
                <p>
                  {audio ? "Mic on" : "Mic off"}
                </p>
              </div>

              <p className='text-muted-foreground text-sm mt-1'>
                Click the red button to end the call.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default VideoCall
