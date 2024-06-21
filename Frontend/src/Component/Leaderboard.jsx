
import { Box, Heading, OrderedList, ListItem, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const Leaderboard = ({ leaderboard }) => {
    return (
        <Box className="leaderboard" p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="lg" mb="4">
                Leaderboard
            </Heading>
            <OrderedList>
                {leaderboard.map((player, index) => (
                    <ListItem key={player.id} mb="2">
                        <Text fontWeight="bold">{index + 1}. {player.name}</Text>
                        <Text ml="2">Score: {player.score}</Text>
                    </ListItem>
                ))}
            </OrderedList>
        </Box>
    );
};

Leaderboard.propTypes = {
    leaderboard: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            score: PropTypes.number.isRequired,
            // Add more PropTypes as needed for other properties
        })
    ).isRequired,
};

export default Leaderboard;
