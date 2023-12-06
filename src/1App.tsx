import React, { useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import abiFile from './abiFile.json';
import './styles.css';
import backgroundGif from './nebulosa.jpg';
import SafuLogo1 from './logo.png';

const CONTRACT_ADDRESS = '0x3121ff90D86128b0dCd2524469f0Aa3E1D5FdB63';
const getExplorerLink = () => `https://scan.maxxchain.org/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

  const [imgURL, setImgURL] = useState('');
  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });
  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintAmount, setMintQuantity] = useState(1);

  const calculateTotalPrice = () => {
    const pricePerToken = 2500;
    return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
  };

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 5));
  };

  const handleDecrement = () => {
    setMintQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const totalPrice = calculateTotalPrice();

      const tx = await mint({
        args: [mintAmount, { value: totalPrice }],
      });

      await tx.wait();
    } catch (error) {
      console.error(error);
    } finally {
      setMintLoading(false);
    }
  };

  return (
    <>
      <header>
        <Text className="header-text">Maximus Walnuts Reward NFT</Text>
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
        <Container className="container" paddingY="4">
          <Tabs>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Token Details</Tab>
              {/* Add more tabs as needed */}
            </TabList>

            <TabPanel>
              {/* Content for Overview Tab */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={SafuLogo1} alt="SaffuMaxx Logo" style={{ width: '18%', height: 'auto' }} />
                </div>
                <Text className="ttitle" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                  Maximus Walnuts Reward NFT
                </Text>
                {/* ... other content for Overview Tab ... */}
              </div>
            </TabPanel>

            <TabPanel>
              {/* Content for Token Details Tab */}
              <div>
                {/* ... content specific to Token Details Tab ... */}
              </div>
            </TabPanel>

            {/* Add more TabPanels as needed for additional tabs */}
          </Tabs>

          {mintError && (
            <Text marginTop='4'>⛔️ Mint unsuccessful! Error message:</Text>
          )}
          {mintError && (
            <pre style={{ marginTop: '8px', color: 'red' }}>
              <code>{JSON.stringify(mintError, null, ' ')}</code>
            </pre>
          )}
          {mintLoading && <Text marginTop='2'>Minting... please wait</Text>}
          {mintedTokenId && (
            <Text marginTop='2'>
              Mint successful! You can view your NFT{' '}
              <Link
                isExternal
                href={getOpenSeaURL()}
                color='blue'
                textDecoration='underline'
              >
                Soon!
              </Link>
            </Text>
          )}

          <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
            &copy; 2023 Maximus Walnuts. All rights reserved.
          </Text>
        </Container>
      </div>
    </>
  );
}

export default App;
