import React from 'react'
import { ModeToggle } from './darkbutton'

const NavBar = () => {
  return (
    <>
    <div className='py-6 flex justify-between items-center px-5'>
        <div className='font-mono  font-bold text-4xl'>
            WALLET
        </div>
        <div>
          
        </div>
      <ModeToggle />
    </div>
    </>
  )
}

export default NavBar