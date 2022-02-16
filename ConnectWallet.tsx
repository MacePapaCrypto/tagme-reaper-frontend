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

  const params = new URLSearchParams(window.location.search);
  if (!params.has("code")) {
    alert("The link you have used is invalid or expired");
    // TODO: Make the page look disabled
  }
  const code = params.get("code");
  // TODO: Verify Code Here (on page load)

  const signMessageToConnect = async () => {
      // Get the user account
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // The Metamask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      const signer = provider.getSigner();
      const message = await signer.signMessage(code!.toString());
      let data = await axios.post("/.netlify/functions/verify", {
        message,
        code,
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

  const connectWalletAndSign = async () => {
    await connectWalletFunction();
    await signMessageToConnect();
  }

  return (
    <div className="connectInfo">
      <a role="button" onClick={connectWalletAndSign} className="connectButton">{ state.walletAddress === "" ? "Connect" : "Connected" }</a>
    </div>
  );
}

