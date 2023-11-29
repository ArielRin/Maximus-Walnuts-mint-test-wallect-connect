// HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import abiFile from './abiFile.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './Dream_Background.jpg';
import HausLogo1 from './logo.png'; // Import your image file
import MainTextLogo from './headerlogo.png'; // Import your image file

const CONTRACT_ADDRESS = '0x42142d58a5a4d7fAc22Fd2D3b5DBf46B04D5d16e';
const getExplorerLink = () => `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://opensea.io/assets/bsc/${CONTRACT_ADDRESS}`;
const getTofuNFTURL = () => `https://opensea.io/assets/bsc/${CONTRACT_ADDRESS}`;

const HomePage = () => {
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

    const maxSupply = 500;
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
            {/* ... (rest of the code from App component) */}
          </Container>
        </div>
      </div>
    </>
  );
};

export default HomePage;
