import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';

const Game = ({ socket, players }) => {
    const [choice, setChoice] = useState('');
    console.log(choice)
    const [result, setResult] = useState('');

    // Handle incoming result from server
    useEffect(() => {
        socket.on('gameResult', (result) => {
            setResult(result);
        });

        // Clean up socket listener on unmount
        return () => {
            socket.off('gameResult');
        };
    }, [socket]);

    const handleChoice = (selectedChoice) => {
        setChoice(selectedChoice);
        socket.emit('makeMove', selectedChoice); // Send player's choice to server
    };

    return (
        <Box className="game" p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="lg" mb="4">
                Game
            </Heading>
            <Flex direction="column" mb="4">
                {players.map((player) => (
                    <Box key={player.id} p="2" borderWidth="1px" borderRadius="md" mb="2">
                        <Text>{player.name}</Text>
                        <Text>Score: {player.score}</Text>
                    </Box>
                ))}
            </Flex>
            <Flex direction="row" mb="4">
                <Button onClick={() => handleChoice('rock')} colorScheme="teal" mr="2">
                    Rock
                </Button>
                <Button onClick={() => handleChoice('paper')} colorScheme="blue" mr="2">
                    Paper
                </Button>
                <Button onClick={() => handleChoice('scissors')} colorScheme="orange">
                    Scissors
                </Button>
            </Flex>
            {result && (
                <Text mt="4" color="green.500">
                    {result}
                </Text>
            )}
        </Box>
    );
};

Game.propTypes = {
    socket: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            score: PropTypes.number.isRequired,
            // Add more PropTypes as needed for other properties
        })
    ).isRequired,
};

export default Game;
