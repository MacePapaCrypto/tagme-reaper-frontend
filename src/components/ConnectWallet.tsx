import { useContext, useEffect } from 'react';
import { Context } from '../Store';
import { checkNetwork } from '../functions/ethersFunctions';
import formatAddress from '../Reducer';

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
    console.log(foundAddress);

    if (foundAddress[0] !== undefined){
      dispatch({ type:'walletAddress', content: foundAddress[0] });
    }
  }

  const signMessageToConnect = async () => {
    
  }

  const connectWalletAndSign = async () => {
    await connectWalletFunction();
    await signMessageToConnect();
  }

  return (
    <div className="connectInfo">
      <a onClick={connectWalletFunction} className="connectButton">{ state.walletAddress === "" ? "Connect" : "Connected" }</a>
    </div>
  );
}

