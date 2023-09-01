import { useEffect, useState } from 'react'

import Header from './components/Header'
import {getSplitHistory, splitsContract, connectWallet} from "../utils/interact"
import { stringify } from 'postcss';

function App() {

  /*
  - Addresses to use
  - contract deployer and first splitter = 0x81215d34367AF48d01E728AfF2976d9Df32fE604
  - splits contract address = 0xC97c3Ad1Cd7160Dc5939068a344A1850c44eb27B
  */

  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState("")
  const [toAddress, setToAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("")
  const [splitHistory, setSplitHistory] = useState("");

  useEffect(() => {

  async function fetchData(){
    const splitHistoryResponse = await getSplitHistory(fromAddress);
    setSplitHistory(splitHistoryResponse)
  }

  

  fetchData();
  // addSmartContractListener();
  }, [])

  //  function addSmartContractListener(){
  //   // splitsContract.events.splitSuccess({}, (error, data) => {
  //   //   if (error){
  //   //     setStatus(" Sorry: ", error.message)
  //   //   }else{
  //   //     setStatus(data.returnValues[2].toString() )
  //   //   }
  //   // })

  //    splitsContract.on("splitSuccess", (from, to, value) => {
  //     console.log("Transfer Event emitted")
  //     console.log(JSON.stringify(from))
  //     console.log(JSON.stringify(to))
  //     console.log(JSON.stringify(value))
  //   })

   
// data.returnValues[0] +data.returnValues[1] s
  // }

  async function addWalletListener(){
   
  }

   async function performSplitPressed(){
    console.log("performing split")
}
  async function connectWalletPressed(){
    console.log("wallet connect attempt...")
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status) 
    setFromAddress(walletResponse.address)
  }

  return (
   <div >
    {/* Header component with the splits logo */}
     <Header
      walletAddress={fromAddress}
      handleConnect={() => connectWalletPressed()}
      />

     {/* Main Card with */}
     <div className='flex justify-center items-center h-screen text-white'>
      <div className='border w-[40%] p-4'>

        <h1 className='text-2xl font-bold'>Perform Split</h1>
        <span>Send half of your balance to the "To Address" </span>

        <form className="mt-2" action="">
          <div className='grid grid-cols-1 gap-y-2'>
          <label htmlFor="fromAddress">From Address</label>
          <input id="fromAddress" className="bg-slate-400" type="text" name='fromAddress' value={fromAddress} readOnly/>
          <label htmlFor="toAddress">To Address</label>
          <input id="toAddress" className="bg-slate-400" type="toAddress" name='toAddress' value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
          </div>
        </form>

        <div className='mt-4'>Status: {status}</div>
        <div className='mt-4'>Split History: {splitHistory === "NA" ? splitHistory : splitHistory + "ETH"}</div>
        
      
        <div className='flex justify-center mt-4'>
        <button className="border h-8 w-36" onClick={performSplitPressed}>Split</button>
        </div>
      </div>
     </div>

   </div>
     
  )
}

export default App
