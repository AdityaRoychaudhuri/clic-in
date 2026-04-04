"use client"
import { getDoctorsBySpeciality } from '@/actions/doctorsList';
import PageHeader from '@/components/PageHeader';
import { useParams } from 'next/navigation'
import React from 'react'

const page = async () => {
    const {speciality} = useParams();
    const specialityName = speciality.split("%20").join(" ");

    const { doctors } = await getDoctorsBySpeciality(specialityName);


  return (
    <div>
        <PageHeader title={specialityName} backLink='/doctors' backToPageLabel='All specialities'/>

        {doctors && doctors.length > 0 ? (
          <div>
            
          </div>
        ) : (
          <div>
            <h3>

            </h3>

            <p>

            </p>
          </div>
        )}
    </div>
  )
}

export default page