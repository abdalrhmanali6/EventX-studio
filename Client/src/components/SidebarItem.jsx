import React from 'react'

function SidebarItem({image,text,...rest}) {
  return (
    <div className='SbarItem cursor-pointer ' {...rest}>
          <img src={image} className='mr-5  w-[1.7rem] ' />
          <p className='text-[#D9D9D9] text-xs sm:text-base '>{text}</p>
        </div>
  )
}

export default SidebarItem