import React from 'react'

const layout = ({ children }) => {
  return (
    <div className='flex justify-center no-scrollbar pt-50'>
      {children}
    </div>
  )
}

export default layout
