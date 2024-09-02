import React from 'react'
import WalletGenerator from './components/Wallet'
import NavBar from './components/NavBar'

const page = () => {
  return (
  <div className='mx-auto max-w-[1080px] px-6 flex flex-col gap-4 p-4 min-h-[92vh]'>
    <NavBar />
    <WalletGenerator />

  </div>
  )
}

export default page
