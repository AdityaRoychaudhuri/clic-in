import React from 'react'
import { Card, CardContent } from './ui/card'
import { PricingTable } from '@clerk/nextjs'

const Pricing = () => {
  return (
    <Card className='bg-gradient-to-b 
            from-primary/15
            via-primary/5 
            to-transparent
            dark:from-primary/30 
            dark:via-primary/20
            border border-border'>
        <CardContent className='p-6 md:p-8'>
            <PricingTable checkoutProps={{
                appearance: {
                    elements:{
                        drawerRoot: {
                            zIndex: 200
                        }
                    }
                }
            }}/>
        </CardContent>
    </Card>
  )
}

export default Pricing