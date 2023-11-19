import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import abiFile from './abiFile.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './Dream_Background.jpg';
import HausLogo1 from './logo.png'; // Import your image file

const CONTRACT_ADDRESS = '0x172499980D37E6590b1bB7BFA0b51C64Dd34f84b'; // final address 2500 pwr ea LIVE
const getExplorerLink = () => `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0); // Added state for totalSupply
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

      const calculateTotalPrice = () => {
        const pricePerToken = 0.0001; // Adjust the price per token as needed
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

        // Call the 'totalSupply' method on the contract
        const supply = await contract.totalSupply();

        // Update the state with the contract name and totalSupply
        setContractName(name);
        setTotalSupply(supply.toNumber());
      } catch (error) {
        console.error('Error fetching contract data:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    }

    fetchContractData();
  }, []); // Empty dependency array to run the effect only once

  const maxSupply = 36;
  const remainingSupply = maxSupply - totalSupply;







  return (
    <>
      <header>
        <img src={HausLogo1} alt="Maxmum Walnuts 2023 Logo" style={{ width: '2%', height: 'auto' }} />
        <Text className="header-text">Maxmum Walnuts 2023</Text>
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={HausLogo1} alt="Haus Logo" style={{ width: '18%', height: 'auto' }} />
            </div>

              <Text className="ttitle" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                Maxmum Walnuts
              </Text>
              <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Add my Description here once u think of what ya bloody making here to test
              </Text>
              <Text className="contractname" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                {loading ? 'Loading...' : `Contract Name: ${contractName || 'N/A'}`}
              </Text>
              <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}  `}
              </Text>
              <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                {loading ? 'Loading...' : `Remaining Supply: ${remainingSupply}`}
              </Text>
              <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                <Link isExternal href={getExplorerLink()}>
                  {CONTRACT_ADDRESS}
                </Link>
              </Text>
            </div>
            <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
              <Button
                marginTop='1'
                textColor='white'
                bg='#557729'
                _hover={{
                  bg: '#99d64b',
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
                bg='#557729'
                _hover={{
                  bg: '#99d64b',
                }}
                onClick={handleIncrement}
                disabled={!isConnected || mintLoading || mintAmount === 5}
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
                bg='#557729'
                _hover={{
                  bg: '#99d64b',
                }}
              >
                {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
              </Button>
            </Box>
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
                  color='#99d64b'
                  textDecoration='underline'
                >
                  Soon!
                </Link>
              </Text>
            )}
              <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
                &copy; Maxmum Walnuts 2023. All rights reserved.
              </Text>
          </Container>


        </div>
      </div>
    </>
  );
}

export default App;
