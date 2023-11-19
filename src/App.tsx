// App.js

import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import abiFile from './abiFile.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './bg.jpg';
import SafuLogo1 from './logo.png'; // Import your image file

// const CONTRACT_ADDRESS = '0xfA0644C86D8bC887496ea2A53aB470f6E85A0f27'; // test address 1 pwr ea
const CONTRACT_ADDRESS = 'HAUS_TOKEN_CONTRACT_TO_BE_ADDED_HERE'; // final address 2500 pwr ea LIVE
const getExplorerLink = () => `https://scan.maxxchain.org/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };



  return (
    <>

    <header>
      <img src={SafuLogo1} alt="Degen Haus 2023 Logo" style={{ width: '2%', height: 'auto' }} />
        <Text className="header-text">Degen Haus 2023</Text>
        <div className="connect-button">
           <ConnectButton />
        </div>
  </header>


    <div className="wrapper" style={{
      backgroundColor: 'black',
      color: 'white',
      backgroundImage: `url(${backgroundGif})`,
      backgroundSize: 'cover',
          }}>

      <div className="mainboxwrapper" >
        <Container className="container" paddingY="4">

          <div>
              <Text className="ttitle" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
              Test Dapp
              </Text>

              <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
              Add my Description here once u think of what ya bloody making here to test
              </Text>

              <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                <Link
                  isExternal
                  href={getExplorerLink()}
                    >
                  {CONTRACT_ADDRESS}
                </Link>
              </Text>

          </div>
        </Container>
       </div>
    </div>
  </>
  );
}

export default App;
