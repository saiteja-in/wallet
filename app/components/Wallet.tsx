"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Wallet = () => {
    const [wallet,setWallet]=useState<string[]>([])
    const [mnemonicInput,setMnemonicInput]=useState<string>("")
  return (
    <div>
      
      {wallet.length===0 ? (<div><h1 className="text-center font-bold font-Mukta text-4xl tracking-tighter ">
        CREATE A WEB WALLET
      </h1><div className="flex flex-row gap-5  justify-center pt-5">
        <Button onClick={()=>{setWallet(["501"]); toast.success("Solana wallet selected.")}} className="text-2xl p-5 font-semibold">SOLANA</Button>
        <Button onClick={()=>{setWallet(["60"]); toast.success("Ethereum wallet selected.")}} className="text-2xl p-5 font-semibold">ETHEREUM</Button>
      </div></div>):(<div className="flex flex-col gap-3 text-left">
       <div className="text-4xl">Secret Recovery Phrase</div>
       <h3>Don't share this with anyone</h3>
       <div className="flex flex-row gap-3">

       <Input onChange={(e)=>setMnemonicInput(e.target.value)} type="password" placeholder="Enter your secret phrase"/>
       <Button className="text-lg font-semibold"  >{mnemonicInput ? "Add Wallet":"Create Wallet"}</Button>
       </div>
      </div>) }
      
    </div>
  );
};

export default Wallet;
