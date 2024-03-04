import { Box, Container, Typography } from "@mui/material";
import { useTheme } from '@mui/system';
import { gamePageStyles } from "./styles/jss/gamePageStyles";
import { CrazyEightContainer } from "../../components/modals/CrazyEight/Container";

export const GamePagePres = ({
    cardState,
    playerActions,
    crazyEight,
}) => {

    const theme = useTheme();

    return (
        <Container
            disableGutters={true}
            maxWidth='xl'
            sx={{
                ...gamePageStyles.topContainer,
                backgroundColor: theme.palette.primary.main,
            }}
        >
            <Container
                sx={{
                    ...gamePageStyles.opponentCardStackContainer
                }}
            >
                {cardState?.computersCardsInHand?.map((card) => (
                    <Box
                        key={card.code}
                        component='img'
                        src={card.image}
                        // src='https://deckofcardsapi.com/static/img/back.png'
                        alt={card.code}
                        sx={{
                            ...gamePageStyles.opponentCardStackContainer.cards
                        }}
                    />
                ))}
            </Container>
            <Container
                style={gamePageStyles.deckOfCardConainer}
            >
                {[...Array(8)].map((_, index) => (
                    <Box
                        // onClick={playerActions.playerDrawsACard}
                        onClick={() => playerActions.playerDrawsACard(false, false)}
                        key={index}
                        component='img'
                        src='https://deckofcardsapi.com/static/img/back.png'
                        alt="deck of cards"
                        sx={{
                            ...index === 0
                                ? gamePageStyles.deckOfCardConainer.firstCard
                                : gamePageStyles.deckOfCardConainer.deck,
                        }}
                    />
                ))}
                <Box
                    component='img'
                    src={cardState?.topCardInPile?.image}
                    alt='Card Pile'
                    sx={{
                        ...gamePageStyles.deckOfCardConainer.cardPool
                    }}
                />
                <Container
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(10%, -50%)',
                    }}
                >
                    {/* {isSpecialCardSelected?.crazyEight?.suitSelected && (
                        <Typography
                            variant='h5'
                        >
                            {isSpecialCardSelected?.crazyEight?.suitSelected} selected!
                        </Typography>
                    )} */}
                </Container>
            </Container>
            <Container
                sx={{ ...gamePageStyles.userCardStackContainer }}
            >
                {cardState?.userCardsInHand?.map((card) => (
                    <Box
                        onClick={() => playerActions.handleUserTurn(card, false)}
                        key={card.code}
                        component='img'
                        src={card.image}
                        alt={card.code}
                        sx={{
                            ...gamePageStyles.userCardStackContainer.cards,
                        }}
                    />
                ))}
            </Container>
            <CrazyEightContainer
                crazyEight={crazyEight}
                handleCrazyEight={playerActions.handleCrazyEight}
            />
        </Container>
    )
};