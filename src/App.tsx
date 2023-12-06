import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import splitterABI from './splitterABI.json';

const SPLITTER_CONTRACT_ADDRESS = '0x2A3A8124b48d0547C227E1D75D6E1FD5DB0D56E0';

const splitterContractConfig = {
  addressOrName: SPLITTER_CONTRACT_ADDRESS,
  contractInterface: splitterABI,
};

const SplitterPage = () => {
  const account = useAccount();
  const { read: getPayeeList } = useContractRead(splitterContractConfig, 'getPayeeList');
  const { send: addPayee } = useContractWrite(splitterContractConfig, 'addPayee');

  const [newPayee, setNewPayee] = useState('');
  const [payees, setPayees] = useState([]);

  const handleAddPayee = async () => {
    try {
      // Call the addPayee function on the contract with the newPayee input
      await addPayee(newPayee);
      // Refresh the payees list after adding a new payee
      await refreshPayees();
      // Clear the input field after successfully adding a payee
      setNewPayee('');
    } catch (error) {
      console.error('Error adding payee:', error.message);
    }
  };

  const refreshPayees = async () => {
    try {
      // Call the getPayeeList function on the contract to get the updated list of payees
      const updatedPayees = await getPayeeList();
      setPayees(updatedPayees);
    } catch (error) {
      console.error('Error fetching payees:', error.message);
    }
  };

  useEffect(() => {
    // Fetch the initial list of payees when the component mounts
    refreshPayees();
  }, [account]); // Trigger a refresh when the Ethereum account changes

  return (

    
    <Container>
      <InputGroup mb={4}>
        <Input
          placeholder="Enter payee address"
          value={newPayee}
          onChange={(e) => setNewPayee(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleAddPayee}>
            Add
          </Button>
        </InputRightElement>
      </InputGroup>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Payee Address</Th>
          </Tr>
        </Thead>
        <Tbody>
          {payees.map((payee) => (
            <Tr key={payee}>
              <Td>{payee}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  );
};

export default SplitterPage;
