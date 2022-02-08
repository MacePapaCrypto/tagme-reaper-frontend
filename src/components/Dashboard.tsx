import '../styling/default.css';
import { useContext, useEffect } from "react";
import { Context } from "../Store";
import ConnectWallet from "./ConnectWallet";
import ImageHeader from './ImageHeader';

export default function DashboardPage() {
    
    const [state, dispatch]:any = useContext(Context);

    const displayNetworkStatusText = () => {
        if (state.walletContextDetected) {
          if (state.onFantomNetwork) {
            return "On Fantom Opera";
          } else {
            return "Please connect to Fantom Opera";
          }
        } else {
          return "Please connect wallet.";
        }
    }

    return(
        <div className="dappContainer">
            <ImageHeader/>
            <ConnectWallet/>
        </div>
    )
}