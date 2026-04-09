"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SlotPicker = ({ days, onSelectedSlot }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const firstDayWithSlots = days.find((day) => day.slots.length > 0)?.date || days[0].date;
  const [activeTab, setActiveTab] = useState(firstDayWithSlots);



  const handleSelect = (slot) => {
    setSelectedSlot(slot);
    console.log(selectedSlot);
  };

  const confirmSelection = () => {
    console.log(selectedSlot)
    if (selectedSlot) {
      onSelectedSlot(selectedSlot);
    }
  };

  return (
    <div className='space-y-6'>
      <Tabs 
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full justify-start overflow-x-auto"
      >
        <TabsList className='w-full border border-accent gap-1'>
          {days.map((day) => (
            <TabsTrigger
              key={day?.date}
              value={day?.date}
              disabled={day.slots?.length === 0}
              className={
                day.slots?.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              <div className='flex gap-2 justify-center items-center'>
                <div className='opacity-80'>
                  {format(new Date(day.date), "MMM d")}
                </div>
                <div>
                  ({format(new Date(day.date), "EEE")})
                </div>
              </div>
              <div className='ml-1 rounded-sm text-xs border border-green-900 py-1 px-2 bg-primary/10 dark:bg-primary/25 text-primary dark:text-green-600'>
                {day.slots.length}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        {days.map((day) => (
          <TabsContent 
            value={day.date}
            key={day.date}
          >
            {day.slots.length > 0 ? (
              <div className='space-y-4'>
                <h3 className='mt-2 text-xl font-semibold'>
                  {day.displayDate}
                </h3>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 space-y-1 px-1'>
                  {day.slots.map((slot) => (
                    <Card
                      key={slot.startTime}
                      className={`cursor-pointer transition-all ${
                        slot.startTime === selectedSlot?.startTime ? "bg-taupe-600/35 border-primary/20" : "border-accent hover:border-primary hover:bg-muted/50"
                      }`}
                      onClick={() => handleSelect(slot)}
                    >
                      <CardContent className='p-3 flex items-center justify-center'>
                        <div className='flex items-center justify-center gap-1'>
                          <Clock
                            className={`size-4 ${selectedSlot?.startTime === slot.startTime ? "text-green-500" : "text-muted-foreground"}`}
                          />
                          <span className={selectedSlot?.startTime === slot.startTime ? "text-black dark:text-white font-semibold" : "text-muted-foreground"}>
                            {format(new Date(slot.startTime), "h:mm a")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Alert className='text-center text-muted-foreground'>
                <AlertDescription className='flex justify-center items-center gap-1 py-8 text-base'>
                  <AlertCircle className='size-4'/>
                  No available slots for this next 4 days.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className='flex justify-end'>
        <Button
          onClick={confirmSelection}
          disabled={!selectedSlot}
        >
          Continue
          <ChevronRight className='size-4'/>
        </Button>
      </div>
    </div>
  )
}

export default SlotPicker
