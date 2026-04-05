import { getDoctorsBySpeciality } from '@/actions/doctorsList';
import DoctorsCard from '@/components/DoctorsCard';
import PageHeader from '@/components/PageHeader';
import { redirect } from 'next/navigation'
import React from 'react'

const page = async ({ params }) => {
    const {speciality} = await params;
    
    if (!speciality) {
      redirect("/doctors");
    }

    // const specialityName = speciality.split("%20").join(" ");
    // console.log(specialityName)

    const { doctors } = await getDoctorsBySpeciality(speciality);

  return (
    <div>
        <PageHeader title={speciality.split("%20").join(" ")} backLink='/doctors' backToPageLabel='All specialities'/>

        {doctors && doctors.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {doctors.map((doctor) => (
              <DoctorsCard key={doctor.id} doctor={doctor}/>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <h3 className='text-xl font-medium text-black dark:text-white mb-2'>
              No doctors available
            </h3>

            <p className='text-muted-foreground'>
              There are currently no verified doctors in this speciality. Please check back later.
              Sorry for the inconvenience caused.
            </p>
          </div>
        )}
    </div>
  )
}

export default page