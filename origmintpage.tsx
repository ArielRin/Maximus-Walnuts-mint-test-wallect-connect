// HomePage.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import abiFile from './abiFile.json';
import raceABI from './raceABI.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './race.jpg';
import HausLogo1 from './logo.png'; // Import your image file
import MainTextLogo from './headerlogo.png'; // Import your image file

const RACE_ADDRESS = '0x18Ff7f454B6A3233113f51030384F49054DD27BF';
const CONTRACT_ADDRESS = '0x42142d58a5a4d7fAc22Fd2D3b5DBf46B04D5d16e';
const getExplorerLink = () => `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://opensea.io/assets/bsc/${CONTRACT_ADDRESS}`;
const getTofuNFTURL = () => `https://opensea.io/assets/bsc/${CONTRACT_ADDRESS}`;



const App = () => {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [contractSymbol, setContractSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);

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
        const [pid, setCurrencyPid] = useState(1);

        const calculateTotalPrice = () => {
          const pricePerToken = 0.0102777; // Adjust the price per token as needed
          return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
        };

        const handleIncrement = () => {
          setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 20));
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

            await tx.wait(); // Wait for the transaction to be mined

          } catch (error) {
            console.error(error);
          } finally {
            setMintLoading(false);
          }
        };



























    useEffect(() => {
      async function fetchContractData() {
        try {
          // Connect to the Ethereum network (replace with your provider details)
          const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

          // Instantiate the contract
          const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);

          // Call the 'name' method on the contract
          const name = await contract.name();

          // Call the 'name' method on the contract
          const symbol = await contract.symbol();

          // Call the 'totalSupply' method on the contract
          const supply = await contract.totalSupply();

          // Update the state with the contract name and totalSupply
          setContractName(name);
          setContractSymbol(symbol);
          setTotalSupply(supply.toNumber());
        } catch (error) {
          console.error('Error fetching contract data:', error);
        } finally {
          setLoading(false); // Set loading to false regardless of success or failure
        }
      }

      fetchContractData();
    }, []); // Empty dependency array to run the effect only once

    const maxSupply = 99;
    const remainingSupply = maxSupply - totalSupply;








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

                    <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                      Approx $2.00USD of BNB per Horse
                    </Text>
                  <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                    <Button
                      marginTop='1'
                      textColor='white'
                      bg='#0c5cb6'
                      _hover={{
                        bg: '#F8B802',
                      }}
                      onClick={handleDecrement}
                      disabled={!isConnected || mintLoading || mintAmount === 1}
                    >
                      -
                    </Button>
                    <Text marginX='3' textAlign='center' fontSize='lg'>
                      {mintAmount}
                    </Text>
                    <Button
                      marginTop='1'
                      textColor='white'
                      bg='#0c5cb6'
                      _hover={{
                        bg: '#F8B802',
                      }}
                      onClick={handleIncrement}
                      disabled={!isConnected || mintLoading || mintAmount === 20}
                    >
                      +
                    </Button>
                  </Box>



                  <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                    <Button
                      disabled={!isConnected || mintLoading}
                      marginTop='6'
                      onClick={onMintClick}
                      textColor='white'
                      bg='#0c5cb6'
                      _hover={{
                        bg: '#F8B802',
                      }}
                    >
                      {isConnected ? ` Enter  ${mintAmount} ` : ' Enter Race Event on (Connect Wallet)'}
                    </Button>
                  </Box>

                  {mintError && (
                    <Text marginTop='4'>⛔️ Entry to Race unsuccessful! Error message:</Text>
                  )}
                  {mintError && (
                    <pre style={{ marginTop: '8px', color: 'red' }}>
                      <code>{JSON.stringify(mintError, null, ' ')}</code>
                    </pre>
                  )}
                  {mintLoading && <Text marginTop='2'>Entry to Race Processing... please wait</Text>}
                  {mintedTokenId && (
                    <Text marginTop='2'>
                      Entry to Race Success. Enjoy the Day!{' '}
                      <Link
                        isExternal
                        href={getOpenSeaURL()}
                        color='#F8B802'
                        textDecoration='underline'
                      >
                        Soon!
                      </Link>
                    </Text>
                  )}
                </Container>



              </div>




            </div>
          </>
        );
      }

      export default App;
