import { useState } from 'react'

import Header from './components/Header'

function App() {

  /*
  - Addresses to use
  - contract deployer and first splitter = 0x81215d34367AF48d01E728AfF2976d9Df32fE604
  - splits contract address = 0xC97c3Ad1Cd7160Dc5939068a344A1850c44eb27B
  */

    const [walletAddress, setWalletAddress] = useState("0x81215d34367AF48d01E728AfF2976d9Df32fE604");
  // getConnected wallet address and set the state of connectedWallet

  // getSplitHistory async function using current connected wallet address 

  // performSplit async function 

  function connectWallet(){
    console.log("wallet connect attempt")
  }


  return (
   <div className='bg-slate-800 h-screen'>
    {/* Header component with the splits logo */}
     <Header
      walletAddress={walletAddress}
      handleConnect={() => connectWallet()}
      />

     {/* Main Card with */}
     {/* Header 3 to call out splits  */}
     {/* Paragraph with a sentence on what the user should do  */}
     {/* Start form with a from label  */}
     {/* input text field that highlights white when clicked into  */}

     {/* to label */}
     {/* input test field that highlights white when clicked or selected */}

     {/* Status label: will emit an event if split is successful */}

     {/* solit history label: displays current split history of from address  */}
    
     

   </div>
     
    
  )
}

export default App
