 import splitsLogo from "../assets/splits.png"

// pass in props 
 function Header({walletAddress, handleConnect}) {
    return (
        <>
            <div className="text-white flex items-center justify-between p-4 border-b border-gray-300 ">
                <div className="flex items-center space-x-2">
                    <img className="h-12" src={splitsLogo} alt="" />
                    <div className="text-2xl">Splits</div>
                </div>
                <button onClick={handleConnect} className="border h-8 w-36">{
                    String(walletAddress).length > 0 ? walletAddress.substr(0,6) + "..." + walletAddress.substr(38): "Connect Wallet"
                }</button>
            </div>
        </>
    )
}

export default Header