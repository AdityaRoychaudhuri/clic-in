"use client"
import { approvePayout } from '@/actions/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import useFetch from '@/hooks/useFetch';
import { format } from 'date-fns';
import { Ban, CircleCheck, Clock, DollarSign, Mail, Stethoscope, User, AlertCircle, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const PendingPayouts = ({ pendingPayouts }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);

  const {
    data: approveData,
    fetchData: approvePayoutFn,
    loading: approveLoading,
  } = useFetch(approvePayout);

  const handleSubmitConfirm = async () => {
    if (!selectedPayout || approveLoading) {
      return;
    }

    const formData = new FormData();
    formData.append("payoutId", selectedPayout.id);

    await(approvePayoutFn(formData));
  }

  const handleViewDetails = (payout) => {
    setSelectedPayout(payout);
    setOpenDialog(true);
  }

  useEffect(() => {
    if (approveData?.success) {
      setSelectedPayout(null);
      setOpenDialog(false);
      toast.success("Payout approved successfully");
    }
  }, [approveData])
  

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Pending Payouts
          </CardTitle>
          <CardDescription>
            Review and approve doctor payout requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPayouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader>
                <div className='flex gap-2 items-start'>
                  <div className='bg-muted/50 md:rounded-full md:p-2'>
                    {/* image */}
                    <User className='h-8 w-8 text-green-800 dark:text-green-600'/>
                  </div>

                  <div className='flex-1 self-center'>
                    <h3 className='text-base font-semibold text-green-900 dark:text-white'>
                      {/* name */}
                      Dr. {payout.doctor.name}
                    </h3>

                    <p className='text-sm text-muted-foreground'>
                      {/* description */}
                      {payout.doctor.speciality}
                    </p>
                  </div>
                </div>
                <CardAction>
                  <Badge
                    variant='outline'
                    className={`rounded-xs hidden md:inline ${
                      payout.status === "DENIED" ? "bg-red-400/30 border-red-400/40 text-red-700 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400"
                      : payout.status === "PROCESSED" ? "bg-primary/20 dark:bg-primary/25 text-green-800 dark:text-green-600"
                      : "bg-amber-600/20 dark:bg-amber-900/20 border-amber-900/30 text-amber-600/85"
                    }`}
                  >
                    {payout.status === "PROCESSING" 
                    ? "PENDING" 
                    : payout.status === "DENIED" 
                    ? "DECLINED"
                    : "APPROVED"
                    }
                  </Badge>
                  <div className='inline md:hidden'>
                    {payout.status === "PROCESSING"
                    ? <Clock className='h-8 w-8 bg-amber-600/20 dark:bg-amber-900/20 border-amber-900/30 text-amber-600/85 rounded-full p-1'/>
                    : payout.status === "DENIED"
                    ? <Ban className='h-8 w-8 bg-red-400/30 border-red-400/40 text-red-700 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400 p-1 rounded-full'/>
                    : <CircleCheck className='h-4 w-4 bg-primary/20 dark:bg-primary/25 text-green-800 dark:text-green-600 p-1'/>
                  }
                  </div>
                </CardAction>
              </CardHeader>

              <CardContent>
                <div className='flex flex-col md:flex-row gap-4 md:gap-0 justify-between'>
                  <div className='space-y-1'>
                    <div className='flex flex-col md:flex-row gap-2 items-start'>
                      <div className='flex gap-1 items-center text-center'>
                        <DollarSign className='h-4 w-4 text-green-800 dark:text-green-600'/>
                        <h3 className='text-base text-muted-foreground flex self-center'>
                          {payout.credits} credits • ${payout.netAmount.toFixed(2)}
                        </h3>
                      </div>

                      <div className='flex gap-1 items-center text-center'>
                        <Mail className='h-4 w-4 text-green-800 dark:text-green-600'/>
                        <p className='text-base text-muted-foreground'>
                          {payout.doctor.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className='text-sm text-muted-foreground'>
                        Requested {format(new Date(payout.createdAt), "MMM d, yyyy 'at' h:mm a")} 
                      </p>
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    onClick={() => handleViewDetails(payout)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className='text-xl font-bold text-green-900 dark:text-white'>Payout Request Details</DialogTitle>
              <DialogDescription>
                Review the payout request information.
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              <div className='space-y-4'>
                <div className='flex items-center gap-1'>
                  <Stethoscope className='h-5 w-5 flex self-center text-green-800 dark:text-green-600'/>
                  <h3 className='text-lg font-medium'>
                    Doctor Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Name
                    </p>
                    <p className="text-black font-medium dark:text-white">
                      Dr. {selectedPayout.doctor.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-black font-medium dark:text-white break-all">{selectedPayout.doctor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Specialty
                    </p>
                    <p className="text-black font-medium dark:text-white">
                      {selectedPayout.doctor.speciality}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Credits
                    </p>
                    <p className="text-black dark:text-white">
                      {selectedPayout.doctor.credit}
                    </p>
                  </div>
                </div>
              </div>

              <div className=''>
                <div className='flex items-center gap-1'>
                  <DollarSign className='h-5 w-5 flex self-center text-green-800 dark:text-green-600'/>
                  <h3 className='text-lg font-medium'>
                    Payout Details
                  </h3>
                </div>
                <div className='bg-accent/30 p-4 rounded-lg space-y-2 mt-4'>
                  <div className='flex justify-between'>
                    <h3 className='text-muted-foreground'>
                      Credits to pay out:
                    </h3>

                    <p className='font-bold'>
                      {selectedPayout.credits}
                    </p>
                  </div>

                  <div className='flex justify-between'>
                    <h3 className='text-muted-foreground'>
                      Gross amount (10 USD/credit):
                    </h3>

                    <p className='font-bold'>
                      ${(selectedPayout.amount).toFixed(2)}
                    </p>
                  </div>

                  <div className='flex justify-between'>
                    <h3 className='text-muted-foreground'>
                      Platform Fee (2 USD/credit):
                    </h3>

                    <p className='font-bold'>
                      - ${selectedPayout.platformFee.toFixed(2)}
                    </p>
                  </div>

                  <Separator/>

                  <div className='flex justify-between my-4'>
                    <h3 className='text-green-900 dark:text-white font-bold text-base'>
                      Net Payout:
                    </h3>

                    <p className='font-bold text-green-700 text-base dark:text-green-500'>
                      ${selectedPayout.netAmount.toFixed(2)}
                    </p>
                  </div>

                  <Separator/>

                  <div className='mt-4'>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Paypal Email
                    </h3>

                    <p className="text-black font-medium dark:text-white break-all">
                      {selectedPayout.doctor.email}
                    </p>
                  </div>
                </div>
              </div>
              {selectedPayout.doctor.credit < selectedPayout.credits && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Warning: Doctor currently has only{" "}
                    {selectedPayout.doctor.credit} credits but this payout
                    requires {selectedPayout.credits} credits. The payout cannot
                    be processed.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className='flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between'>
              <Button
                variant='destructive'
                disabled={approveLoading}
                onClick={() => setOpenDialog(false)}
              >
                Deny
              </Button>

              <Button
                disabled={approveLoading}
                onClick={handleSubmitConfirm}
              >
                {approveLoading ? (
                  <>
                    <Loader2 className='size-4 animate-spin'/>
                    Approving
                  </>
                ) : (
                  "Approve Payout"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default PendingPayouts