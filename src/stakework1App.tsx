// App.js

import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box, Link } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';


import './styles.css';

import { ethers } from 'ethers';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';

import abiFile from './abiFile.json';
import stakingAbi from './stakingAbi.json';

// Replace with the actual ABI for your staking contract

const CONTRACT_ADDRESS = '0x3121ff90D86128b0dCd2524469f0Aa3E1D5FdB63'; // Replace with your contract address

function App() {
  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

  const stakingContractConfig = {
    addressOrName: '0x18Ed09D95dc7E670Eb917de97127445Cd7832Ed6', // Replace with your staking contract address
    contractInterface: stakingAbi,
  };

  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });

  const { writeAsync: deposit, error: depositError } = useContractWrite({
    ...stakingContractConfig,
    functionName: 'deposit',
  });

  const { writeAsync: withdraw, error: withdrawError } = useContractWrite({
    ...stakingContractConfig,
    functionName: 'withdraw',
  });

  const { readAsync: getStakingInfo } = useContractRead({
    ...stakingContractConfig,
    functionName: 'getStakingInfo', // Replace with the actual function in your staking contract
  });

  const [stakingAmount, setStakingAmount] = useState(0);
  const [stakingLoading, setStakingLoading] = useState(false);

  const handleStake = async () => {
    try {
      setStakingLoading(true);
      const tx = await deposit({
        args: [ethers.utils.parseEther(stakingAmount.toString())],
      });
      await tx.wait();
    } catch (error) {
      console.error(error);
    } finally {
      setStakingLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setStakingLoading(true);
      const tx = await withdraw({
        args: [ethers.utils.parseEther(stakingAmount.toString())],
      });
      await tx.wait();
    } catch (error) {
      console.error(error);
    } finally {
      setStakingLoading(false);
    }
  };

  const { address } = useAccount();
  const isConnected = !!address;

  return (
    <>
      <header>
        <Text className="header-text">StakeKINDEINU MOFO's</Text>
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>

      <div className="wrapper" style={{ backgroundColor: 'black', color: 'white' }}>
        <div className="mainboxwrapper">
          <Container className="container" paddingY="4">
            {/* Existing code */}

            <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
              <input
                type='number'
                value={stakingAmount}
                onChange={(e) => setStakingAmount(e.target.value)}
              />
              <Button
                marginTop='6'
                onClick={handleStake}
                textColor='white'
                bg='blue.500'
                _hover={{
                  bg: 'blue.700',
                }}
                disabled={!isConnected || stakingLoading}
              >
                Stake
              </Button>
              <Button
                marginTop='6'
                onClick={handleWithdraw}
                textColor='white'
                bg='blue.500'
                _hover={{
                  bg: 'blue.700',
                }}
                disabled={!isConnected || stakingLoading}
              >
                Withdraw
              </Button>
            </Box>

            {/* Existing code */}
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;
