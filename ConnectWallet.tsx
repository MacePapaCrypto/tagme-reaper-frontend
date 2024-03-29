import { useContext, useEffect } from 'react';
import { Context } from '../Store';
import { checkNetwork } from '../functions/ethersFunctions';
import formatAddress from '../Reducer';
import { ethers, Wallet } from 'ethers';
import axios from 'axios';

declare const window:any;

export default function ConnectWallet() {
  
  const [state, dispatch]:any = useContext(Context);

  useEffect(() => {
    console.log('walletContextDetected: ', state.walletContextDetected);
  }, [state.walletContextDetected]);

  const connectWalletFunction = async () => {

    if (window.ethereum !== undefined && !checkNetwork()) {
      console.log("wallet connect error");
      return;
    }

    const foundAddress = await window.ethereum.request({ method: "eth_requestAccounts" });
    //console.log(foundAddress);

    if (foundAddress[0] !== undefined){
      dispatch({ type:'walletAddress', content: foundAddress[0] });
    }
  }

  const signMessageToConnect = async () => {
      // Get the user account
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // The Metamask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      const signer = provider.getSigner();
      const message = await signer.signMessage("Connect your wallet for goodies.");
      let data = await axios.post("/.netlify/functions/verify", {
        message,
        account,
      });
      console.log(data);
      console.log(account);
      console.log(provider);

      if (data.data.verified) {
        setTimeout(() => {
          alert("Verification successful! You can safely close this page.");
        }, 30);
      } else {
        alert(
          "Verification was unsuccessful. Please try verifying again on discord."
        );
      }
  }

  return (
    <div className="connectInfo">
      {
        state.walletAddress === "" ? 
        <a role="button" onClick={connectWalletFunction} className="connectButton">Connect</a> :
        <a role="button" onClick={signMessageToConnect} className="connectButton">Sign</a>
      }
      
    </div>
  );
}

