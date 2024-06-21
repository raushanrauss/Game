import { useState } from 'react';
import {
    Box,
    Heading,
    List,
    ListItem,
    Input,
    Button,
    FormControl,
    FormLabel,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const WaitingList = ({ waitingList, socket }) => {
    const [playerName, setPlayerName] = useState('');

    const handleJoinGame = () => {
        if (playerName.trim() === '') {
            alert('Please enter your name.');
            return;
        }

        // Emit 'joinGame' event with player's name
        socket.emit('joinGame', playerName.trim());
        // Optionally clear the input field after joining
        setPlayerName('');
    };

    return (
        <Box className="waiting-list" p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="lg" mb="4">
                Waiting List
            </Heading>
            <List mb="4">
                {waitingList.map((player) => (
                    <ListItem key={player.id} mb="2">
                        {player.name}
                    </ListItem>
                ))}
            </List>
            <FormControl>
                <FormLabel htmlFor="playerName">Enter your name</FormLabel>
                <Input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    mb="2"
                />
                <Button onClick={handleJoinGame} colorScheme="teal">
                    Join Game
                </Button>
            </FormControl>
        </Box>
    );
};

WaitingList.propTypes = {
    waitingList: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            // Add more PropTypes as needed for other properties
        })
    ).isRequired,
    socket: PropTypes.object.isRequired,
};

export default WaitingList;
