// App.js

import React, { useEffect, useState } from 'react';
import { Text, Link, Container } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const NFT_CONTRACT_ADDRESS = '0x854af02c36c815e27f3d0496f38E5aC5Aa56a703'; // Replace with your NFT contract address
const OPENSEA_API_KEY = 'd1eb4fea669a4ceca1313db2e4b83637'; // Replace with your actual OpenSea API key

function App() {
  const { address, isConnected } = useAccount();
  const [isNFTOwner, setIsNFTOwner] = useState(false);

  useEffect(() => {
    const checkNFTOwnership = async () => {
      if (isConnected) {
        const openSeaAPI = `https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`;

        try {
          const response = await fetch(openSeaAPI, {
            headers: {
              'X-API-KEY': OPENSEA_API_KEY,
            },
          });

          if (!response.ok) {
            throw new Error(`OpenSea API request failed with status ${response.status}`);
          }

          const data = await response.json();
          const ownedNFTs = data.assets.filter((asset) => asset.asset_contract.address.toLowerCase() === NFT_CONTRACT_ADDRESS.toLowerCase());

          setIsNFTOwner(ownedNFTs.length > 0);
        } catch (error) {
          console.error('Error fetching OpenSea API:', error.message);
        }
      }
    };

    checkNFTOwnership();
  }, [address, isConnected]);

  return (
    <>
      <header>
        <Text className="header-text">Maximus Walnuts Reward NFT</Text>
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>

      <div className="wrapper" style={{ backgroundColor: 'black', color: 'white' }}>
        <div className="mainboxwrapper">
          <Container className="container" paddingY="4">
            <div>
              {/* ... (your existing content) ... */}

              {isNFTOwner ? (
                <Text className="staking-message" style={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>
                  You Own the required NFT! Staking is available.
                </Text>
              ) : (
                <Text className="staking-message" style={{ textAlign: 'center', fontWeight: 'bold', color: 'red' }}>
                  You don't own the required NFT for staking. Please follow the link to purchase an NFT for staking{' '}
                  <Link
                    isExternal
                    href={`https://opensea.io/assets/${NFT_CONTRACT_ADDRESS}`}
                    color='blue'
                    textDecoration='underline'
                  >
                    here.
                  </Link>
                </Text>
              )}
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;
