/* eslint-disable react/jsx-no-undef */
import React, { useContext, useEffect }  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Context } from '../Store';
import { ethers } from 'ethers';
import '../styling/App.css';
import { initializeEthers } from '../functions/ethersFunctions';
import DashboardPage from './Dashboard';

declare const window:any;

function App() {

  const [state, dispatch]:any = useContext(Context);

  const checkMetaMaskContext = () => {
    try {
      new ethers.providers.Web3Provider(window.ethereum);
      return true;
    } catch {
      return false;
    }
  }
  
  useEffect(() => {
    dispatch({type: 'triggerAll', content: true})
    if (checkMetaMaskContext()) {
      initializeEthers(dispatch);
      window.ethereum.on("chainChanged", (chainId:string) => {
        if (chainId === "0xfa") {
          dispatch({type: "onFantomNetwork", content: true});
        } else {
          dispatch({type: "onFantomNetwork", content: false});
        }
      });
    }
  }, []);

  return (
    <Router>
      <div>
          <Routes>
              <Route path="/" element={<DashboardPage />} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;