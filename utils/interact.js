// Add alchmey add ons from https://github.com/alchemyplatform/Alchemy-Hacker-Handbook/blob/main/evm_snippets/LoadContract/load-contract.js
import { Network, Alchemy } from "alchemy-sdk";
import { ethers, formatEther } from "ethers";
// import dotenv from "dotenv";

// dotenv.config();

// config alchemy provider

const settings = {
  apiKey: import.meta.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);
const provider = await alchemy.config.getProvider();

const splitsAddress = "0xC97c3Ad1Cd7160Dc5939068a344A1850c44eb27B";
const splitsABI = [
  {
    inputs: [],
    name: "FailedToSend",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "valueSent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "halfValue",
        type: "uint256",
      },
    ],
    name: "InvalidSplit",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "fromAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "toAddess",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "etherAmount",
        type: "uint256",
      },
    ],
    name: "splitSuccess",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "searchAddress",
        type: "address",
      },
    ],
    name: "getSplitHistory",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "toAddress",
        type: "address",
      },
    ],
    name: "sendSplit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

export const splitsContract = new ethers.Contract(
  splitsAddress,
  splitsABI,
  provider
);

export async function getSplitHistory(fromAddress) {
  if (fromAddress == "") {
    console.log("...Couldn't find history for non existing address");
    return "";
  }
  const historyInWei = await splitsContract.getSplitHistory(fromAddress);
  const historyToEth = formatEther(historyInWei);
  console.log("Grabbing the split history ", historyToEth);
  return historyToEth.substring(0, 7);
}

export async function performSplit(toAddress, value) {}

export async function connectWallet() {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const obj = {
        status: "Perform a split ...",
        address: addressArray[0],
      };

      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "You need to download MM",
    };
  }
}

export async function getCurrentWalletConnected() {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Perform a split ...",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: "downlaod mm",
    };
  }
}
