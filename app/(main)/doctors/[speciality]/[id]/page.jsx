import { getAvailableTimeSlots, getDoctorById } from '@/actions/appointments';
import { redirect } from 'next/navigation';
import React from 'react'
import DoctorProfile from './_components/DoctorProfile';

const page = async ({ params }) => {
  const { id } = await params;

  try {
    const [ doctor, doctorAvailableSlots ] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlots(id)
    ]);

    return (
      <DoctorProfile doctorData={doctor.doctor} doctorAppoitnments={doctorAvailableSlots.days}/>
    )

  } catch (error) {
    console.error("Error loading doctor profile: "+error);
    redirect("/doctors");
  }

}

export default page
