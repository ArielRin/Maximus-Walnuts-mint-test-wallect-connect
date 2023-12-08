// HomePage.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import abiFile from './raceABI.json';
import { useAccount, useContractWrite } from 'wagmi';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './race.jpg';
import MainTextLogo from './headerlogo.png'; // Import your image file

const CONTRACT_ADDRESS = '0x42142d58a5a4d7fAc22Fd2D3b5DBf46B04D5d16e';



const App = () => {

  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };































  return (
    <>
      <header>
        <img src={MainTextLogo} alt="Logo" className="logo" />
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>
            <div
              className="wrapper"
              style={{
                backgroundColor: 'black',
                color: 'white',
                backgroundImage: `url(${backgroundGif})`,
                backgroundSize: 'cover',
              }}
            >
              <div className="mainboxwrapper">
                <Container className="container" paddingY="4">
                  <div>

                    <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                      Race 1 Entry
                    </Text>

                  </div>

                </Container>






              </div>




            </div>
          </>
        );
      }

      export default App;
