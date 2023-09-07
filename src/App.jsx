import { useEffect, useState } from "react";
import Header from "./components/Header";
import {
  splitsAddress,
  splitsABI,
  getSplitHistory,
  performSplit,
  connectWallet,
  getCurrentWalletConnected,
  getAccountBalance,
} from "../utils/interact";
import { ethers } from "ethers";

function App() {
  const [status, setStatus] = useState("Waiting for wallet connect...");
  const [toAddress, setToAddress] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [splitHistory, setSplitHistory] = useState("");
  const [fromAddressBalance, setFromAddressBalance] = useState("");
  const [isEthAddress, setIsEthAddress] = useState(true);
  const [splitEvent, setSplitEvent] = useState({
    from: "null",
    to: "null",
    value: "null",
  });

  useEffect(() => {
    fetchConnectWalletData();
    addWalletListener();
    addSmartContractListener();
  }, []);

  async function addSmartContractListener() {
    if (fromAddress !== "") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const splitsContract = new ethers.Contract(
        splitsAddress,
        splitsABI,
        provider
      );

      splitsContract.on("splitSuccess", (from, to, value) => {
        console.log("Split Event emitted");
        console.log(JSON.stringify(from));
        console.log(JSON.stringify(to));
        console.log(JSON.stringify(String(value)));
        let newSplitEvent = {
          from: from,
          to: to,
          value: String(value),
        };
        setSplitEvent(newSplitEvent);
      });
    }
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (arrayOfAccounts) => {
        if (arrayOfAccounts.length > 0) {
          async function updateAccounts(arrayOfAccounts) {
            console.log("updating accounts");
            const splitHistoryResponse = await getSplitHistory(
              arrayOfAccounts[0]
            );
            const { addressStatuss, balance } = await getAccountBalance(
              arrayOfAccounts[0]
            );
            setFromAddress(arrayOfAccounts[0]);
            setStatus("Accounts changed");
            setSplitHistory(splitHistoryResponse);
            setFromAddressBalance(balance);
          }
          updateAccounts(arrayOfAccounts);
        } else {
          setFromAddress("");
          setStatus("connnect to mm");
        }
      });
    } else {
      setStatus("you must install metamask");
    }
  }

  async function fetchConnectWalletData() {
    const { address, status } = await getCurrentWalletConnected();
    const splitHistoryResponse = await getSplitHistory(address);
    const { addressStatuss, balance } = await getAccountBalance(address);
    console.log(`balance of wallet ${address}, is ${balance}`);
    // Need to update the status, address, splitHistory when reload occurs. This is needed because MM will show up as connected on first load if it's been connected in the past
    setStatus(status);
    setFromAddress(address);
    setSplitHistory(splitHistoryResponse);
    setFromAddressBalance(balance);
  }

  async function performSplitPressed() {
    //from balance can have a max trail of 18 digits

    if (
      (toAddress.length == 42) &
      (toAddress.substring(0, 2).toUpperCase() == "0X")
    ) {
      console.log("split check success");
      setIsEthAddress(true);
      setStatus("Split Submitted");

      const balanceToSplit = fromAddressBalance / 2;

      const fixedBalancedToSplit = balanceToSplit.toFixed(17);

      console.log("split with: ", fixedBalancedToSplit);

      let response = await performSplit(
        fromAddress,
        toAddress,
        fixedBalancedToSplit
      );
      console.log("the response of attempting the tx is: ", response);
      const splitHistoryResponse = await getSplitHistory(fromAddress);
      setStatus(response.status);
      setSplitHistory(splitHistoryResponse);
    } else {
      setIsEthAddress(false);
      setStatus(
        "Incorrect Eth Address: Change the `To address` to be a valid eth address"
      );
      console.log("wrong address");
    }
  }
  async function connectWalletPressed() {
    const walletResponse = await connectWallet();

    // Sets the status and from address but this doesn't change until the whole function completes
    setStatus(walletResponse.status);
    setFromAddress(walletResponse.address);

    const { addressStatus, balance } = await getAccountBalance(
      walletResponse.address
    );
    console.log("grabbing balance for initial connect", balance);
    setFromAddressBalance(balance);

    const splitHistoryResponse = await getSplitHistory(walletResponse.address);
    setSplitHistory(splitHistoryResponse);
  }

  return (
    <div>
      {/* Header component with the splits logo */}
      <Header
        walletAddress={fromAddress}
        handleConnect={connectWalletPressed}
      />

      {/* Main Card */}
      <div className="flex justify-center items-center text-white mt-20">
        <div className="border w-[50%] max-w-prose p-4">
          <h1 className="text-2xl font-bold">Perform Split</h1>
          <span>Send half of your balance to the "To Address" </span>

          <form className="mt-2" action="">
            <div className="grid grid-cols-1 gap-y-2">
              <label htmlFor="fromAddress">From Address</label>
              <input
                id="fromAddress"
                className="bg-slate-400"
                type="text"
                name="fromAddress"
                value={fromAddress}
                readOnly
              />
              <label htmlFor="toAddress">To address</label>
              {isEthAddress ? (
                <input
                  id="toAddress"
                  className="bg-slate-400"
                  type="toAddress"
                  name="toAddress"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                />
              ) : (
                <input
                  id="toAddress"
                  className="border border-red-500 bg-slate-400"
                  type="toAddress"
                  name="toAddress"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                />
              )}
            </div>
          </form>

          <div className="mt-4">Status: {status}</div>
          <div className="mt-4">
            Split History:{" "}
            {splitHistory === "" ? splitHistory : splitHistory + " ETH"}
          </div>
          <div className="mt-4">
            Latest Events: (From {JSON.stringify(splitEvent.from)}) (To{" "}
            {JSON.stringify(splitEvent.to)}) (Value
            {JSON.stringify(splitEvent.value)})
          </div>

          <div className="flex justify-center mt-4">
            <div>
              <button className="border h-8 w-36" onClick={performSplitPressed}>
                Split
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
