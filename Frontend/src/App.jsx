import { useState, useEffect } from 'react';
import { Box, Center, ChakraProvider, Container, Heading } from '@chakra-ui/react';
import io from 'socket.io-client';
import Game from './Component/Game';
import Leaderboard from './Component/Leaderboard';
import WaitingList from './Component/WaitingList';

const socket = io('http://localhost:5000'); // Replace with your server URL

const App = () => {
  const [players, setPlayers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    // Socket events
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('updateLeaderboard', (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    socket.on('updateWaitingList', (updatedWaitingList) => {
      setWaitingList(updatedWaitingList);
    });

    // Clean up socket connection on unmount or as needed
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ChakraProvider>
      <Box bg="gray.100" minHeight="100vh">
        <Container maxW="container.lg" p="4">
          <Center>
            <Heading as="h1" size="xl" mb="4" mt="8">
              Multiplayer Rock Paper Scissors Game
            </Heading>
          </Center>
          <Box bg="white" p="4" borderRadius="lg" boxShadow="md">
            <Game socket={socket} players={players} />
            <Leaderboard leaderboard={leaderboard} />
            <WaitingList waitingList={waitingList} socket={socket} />
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default App;
