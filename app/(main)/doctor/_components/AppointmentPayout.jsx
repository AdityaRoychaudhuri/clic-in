"use client"

import { requestPayout } from '@/actions/payout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useFetch from '@/hooks/useFetch';
import { format } from 'date-fns';
import { AlertCircle, Calendar, ChartColumn, Coins, CreditCard, Loader2, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const AppointmentPayout = ({ earningDetails = [], doctorPayouts }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");

  const {
    totalEarning = 0,
    thisMonthEarning = 0,
    averageMonthylyEarning = 0,
    availableCredits = 0,
    availablePayout = 0,
    completedAppointments = 0
  } = earningDetails;

  const {
    data: requestPayoutData,
    loading: requestPayoutLoading,
    error: requestPayoutError,
    fetchData: requestPayoutFn,
    setData: requestPayoutSetData
  } = useFetch(requestPayout);
  
  const pendinPayouts = doctorPayouts.find((payout) => payout.status === "PROCESSING");
  const platformFee = availableCredits * 2;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paypalEmail) {
      toast.error("PayPal email is required");
      return;
    }

    const formData = new FormData();
    formData.append("paypalEmail", paypalEmail);

    await requestPayoutFn(formData);
  }

  useEffect(() => {
    if (requestPayoutData?.success) {
      toast.success("Payout request submitted successfully");
      setPaypalEmail("");
      setOpenDialog(false);
    }
  }, [requestPayoutData])
  

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardContent className="p-6">
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Available credits
                </h3>

                <p className='text-3xl font-bold text-black dark:text-white'>
                  {availableCredits}
                </p>

                <p className='text-muted-foreground text-xs'>
                  ${availablePayout.toFixed(2)} available for payout
                </p>
              </div>
              <div className='bg-green-900/20 p-3 rounded-full'>
                <Coins className='h-6 w-6 text-green-800 dark:text-green-500'/>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-sm text-muted-foreground'>
                  This Month
                </h3>

                <p className='text-3xl font-bold text-black dark:text-white'>
                  ${thisMonthEarning.toFixed(2)}
                </p>
              </div>
              <div className='bg-green-900/20 p-3 rounded-full'>
                <TrendingUp className='h-6 w-6 text-green-800 dark:text-green-500'/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Total Appointments
                </h3>

                <p className='text-3xl font-bold text-black dark:text-white'>
                  {completedAppointments}
                </p>

                <p className='text-muted-foreground text-xs'>
                  completed appointments
                </p>
              </div>
              <div className='bg-green-900/20 p-3 rounded-full'>
                <Calendar className='h-6 w-6 text-green-800 dark:text-green-500'/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className='flex justify-between items-center'>
              <div>
                <h3 className='text-sm text-muted-foreground'>
                  Avg/Month
                </h3>

                <p className='text-3xl font-bold text-black dark:text-white'>
                  ${averageMonthylyEarning.toFixed(2)}
                </p>

                <p className='text-muted-foreground text-xs'>
                  average monthly payout
                </p>
              </div>
              <div className='bg-green-900/20 p-3 rounded-full'>
                <ChartColumn className='h-6 w-6 text-green-800 dark:text-green-500'/>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-xl font-bold text-black dark:text-white flex items-center gap-2'>
            <CreditCard className='h-5 w-5 text-green-800 dark:text-green-500'/>
            Payout Management
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className='bg-background/50 p-4 rounded-lg border border-emerald-900/20'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-black dark:text-white'>
                Available for payout
              </h3>
              {pendinPayouts ? (
                <Badge
                  variant='outline'
                  className="bg-amber-600/20 dark:bg-amber-900/20 border-amber-900/30 text-amber-600/85 rounded-xs"
                >
                  PROCESSING
                </Badge>
              ) : (
                <Badge
                  variant='outline'
                  className='bg-primary/20 dark:bg-primary/25 text-green-800 dark:text-green-600 rounded-xs'
                >
                  AVAILABLE
                </Badge>
              )}
            </div>

            {pendinPayouts ? (
              <div className='space-y-4'>
                <div className='flex items-center justify-around mt-4 p-2'>
                  <div className='space-y-2'>
                    <h3 className='text-muted-foreground'>
                      Available Credits
                    </h3>

                    <p className='text-center text-2xl font-semibold'>
                      {availableCredits}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h3 className='text-muted-foreground'>
                      Payout Amount
                    </h3>

                    <p className='text-center text-2xl font-semibold'>
                      ${availablePayout.toFixed(2)}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h3 className='text-muted-foreground'>
                      Platform Fee
                    </h3>

                    <p className='text-center text-2xl font-semibold'>
                      ${platformFee.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Alert className='text-center flex items-center justify-center'>
                  <div className='flex items-center gap-2 align-middle'>
                    <AlertCircle className="h-3 w-3 ml-2 hidden md:inline"/>
                    <AlertDescription className="text-sm">
                      Your payout request is being processed. You'll receive the
                      payment once an admin approves it. Your credits will be
                      deducted after processing.
                    </AlertDescription>
                  </div>
                </Alert>
              </div>
            ) : (
              <div className='mb-4'>
                <div className='flex items-center justify-around mt-4 p-2'>
                  <div className='space-y-2'>
                    <h3 className='text-muted-foreground'>
                      Available Credits
                    </h3>

                    <p className='text-center text-2xl font-semibold'>
                      {availableCredits}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h3 className='text-muted-foreground'>
                      Payout Amount
                    </h3>

                    <p className='text-center text-2xl font-semibold'>
                      ${availablePayout.toFixed(2)}
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <h3 className='text-muted-foreground'>
                      Platform Fee
                    </h3>

                    <p className='text-center text-2xl font-semibold'>
                      ${platformFee.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!pendinPayouts && availableCredits > 0 && (
              <Button
                className='w-full'
                onClick={() => setOpenDialog(true)}
              >
                Request Payout for All Credits
              </Button>
            )}

            {!pendinPayouts && availableCredits === 0 && (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">
                  No credits available for payout. Complete more appointments to
                  earn credits.
                </p>
              </div>
            )}
          </div>

          <Alert className='flex items-start mt-2'>
            <div className='mr-1'>
              <AlertCircle className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
            </div>
            <AlertDescription className="text-sm leading-relaxed">
              <span className="font-bold">Payout Structure:</span>{" "} 
              <span className='block md:inline'>
                You earn $8 per credit.
                Platform fee is $2 per credit. Payouts include all your available
                credits and are processed via PayPal.
              </span>
            </AlertDescription>
          </Alert>

          {doctorPayouts.length > 0 && (
            <div className='space-y-4 mt-4'>
              <h3 className='text-xl font-bold'>
                Payout History
              </h3>

              <div className='space-y-2'>
                {doctorPayouts.slice(0,5).map((payout) => (
                  <Card
                    key={payout.id}
                    className='bg-background/40'
                  >
                    <CardHeader>
                      <CardTitle className='text-lg font-bold'>
                        {format(new Date(payout.createdAt), "MMM d, yyyy")}
                      </CardTitle>

                      <CardDescription className='text-sm'>
                        <p>
                          {payout.credits} credits
                          •
                          ${payout.netAmount}
                        </p>
                        <p>
                          {payout.paypalEmail}
                        </p>
                      </CardDescription>
                      <CardAction>
                        <Badge
                          variant='outline'
                          className={`rounded-xs ${
                            payout.status === "DENIED" ? "bg-red-400/30 border-red-400/40 text-red-700 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400"
                            : payout.status === "PROCESSED" ? "bg-primary/20 dark:bg-primary/25 text-green-800 dark:text-green-600"
                            : "bg-amber-600/20 dark:bg-amber-900/20 border-amber-900/30 text-amber-600/85"
                          }`}
                        >
                          {payout.status}
                        </Badge>
                      </CardAction>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog} className=''>
          <DialogContent className=''>
            <DialogHeader>
              <DialogTitle className='text-lg font-bold text-green-900 dark:text-white'>Request Payout</DialogTitle>
              <DialogDescription>
                Request payout for all your available credits.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className='space-y-4'>
                <div className='bg-accent/30 p-4 rounded-lg space-y-2'>
                  <div className='flex justify-between'>
                    <h3 className='text-muted-foreground'>
                      Available Credits
                    </h3>

                    <p className='font-bold'>
                      {availableCredits}
                    </p>
                  </div>

                  <div className='flex justify-between'>
                    <h3 className='text-muted-foreground'>
                      Gross amount
                    </h3>

                    <p className='font-bold'>
                      ${(availableCredits*10).toFixed(2)}
                    </p>
                  </div>

                  <div className='flex justify-between'>
                    <h3 className='text-muted-foreground'>
                      Platform Fee (20%)
                    </h3>

                    <p className='font-bold'>
                      - ${platformFee.toFixed(2)}
                    </p>
                  </div>

                  <div className='flex justify-between mt-4'>
                    <h3 className='text-green-900 dark:text-white font-bold text-base'>
                      Net Payout
                    </h3>

                    <p className='font-bold text-green-700 text-base dark:text-green-500'>
                      ${availablePayout.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <Label htmlFor="paypalEmail">
                    PayPal Email
                  </Label>
                  <Input
                    placeholder="paypal@gmail.com"
                    id="paypalEmail"
                    type="email"
                    value={paypalEmail}
                    onChange={(email) => setPaypalEmail(email.target.value)}
                    required
                  />

                  <p className='text-sm text-muted-foreground text-center'>
                    Enter the PayPal email to receive the payout.
                  </p>
                </div>

                <Alert className='flex items-start mt-2'>
                  <div className='mr-1'>
                    <AlertCircle className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
                  </div>
                  <AlertDescription className="text-sm leading-relaxed">
                    <span className="font-bold">Payout Structure:</span>{" "} 
                    <span className='block md:inline'>
                      Once processed by admin, {availableCredits} credits will be
                      deducted from your account and ${availablePayout.toFixed(2)}{" "}
                      will be sent to your PayPal.
                    </span>
                  </AlertDescription>
                </Alert>

                <div className='flex justify-between'>
                  <Button
                    variant='outline'
                    onClick={() => setOpenDialog(false)}
                    disabled={requestPayoutLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={requestPayoutLoading}
                  >
                    {requestPayoutLoading ? (
                      <>
                        <Loader2 className='size-4 animate-spin'/>
                        Requesting...
                      </>
                    ) : (
                      <>
                        Request Payout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default AppointmentPayout