// https://bsc-dataseed1.ninicoin.io

import React, { useEffect, useState } from 'react';
import { Button, Container, Text, Box } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import abiFile from './abiFile.json';

import backgroundGif from './race.jpg';
import MainTextLogo from './headerlogo.png';

const CONTRACT_ADDRESS = '0x4e7a257b16997215273beCD317f169A3a901FE33';

const App = () => {
  const { writeAsync: enterRace } = useContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
    functionName: 'enterRace',
  });
  const [raceId, setRaceId] = useState(1);
  const [qty, setQty] = useState(1);
  const [raceLoading, setRaceLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;

  const calculateTotalPrice = () => {
    const ticketCost = 0.0123;
    return ethers.utils.parseEther((qty * ticketCost).toString());
  };

  const handleIncrement = () => {
    setQty((prevQty) => Math.min(prevQty + 1, 20));
  };

  const handleDecrement = () => {
    setQty((prevQty) => Math.max(prevQty - 1, 1));
  };

  const onEnterRaceClick = async () => {
    try {
      setRaceLoading(true);

      const totalPrice = calculateTotalPrice();

      const tx = await enterRace({
        args: [raceId, qty],
        options: {
          value: totalPrice,
        },
      });

      await tx.wait();
    } catch (error) {
      console.error('Error during enterRace:', error);
    } finally {
      setRaceLoading(false);
    }
  };

  useEffect(() => {
    // You can perform any necessary contract initialization here if needed
  }, []);

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
                Race {raceId} Entry
              </Text>
            </div>

            <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
              Approx $2.00 USD of BNB per Horse
            </Text>

            <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
              <Button
                marginTop='1'
                textColor='white'
                bg='#0c5cb6'
                _hover={{
                  bg: '#F8B802',
                }}
                onClick={onEnterRaceClick}
                disabled={!isConnected || raceLoading || qty === 0}
              >
                Enter Race
              </Button>
            </Box>

            <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
              <Button
                marginTop='1'
                textColor='white'
                bg='#0c5cb6'
                _hover={{
                  bg: '#F8B802',
                }}
                onClick={handleDecrement}
                disabled={!isConnected || raceLoading || qty === 1}
              >
                -
              </Button>
              <Text marginX='3' textAlign='center' fontSize='lg'>
                {qty}
              </Text>
              <Button
                marginTop='1'
                textColor='white'
                bg='#0c5cb6'
                _hover={{
                  bg: '#F8B802',
                }}
                onClick={handleIncrement}
                disabled={!isConnected || raceLoading || qty === 20}
              >
                +
              </Button>
            </Box>
          </Container>
        </div>
      </div>
    </>
  );
};

export default App;
