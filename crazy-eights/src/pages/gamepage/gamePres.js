import { Box, Container } from "@mui/material";
import { useTheme } from '@mui/system';
import { gamePageStyles } from "./styles/jss/gamePageStyles";
import { CrazyEightContainer } from "../../components/modals/CrazyEight/container";

export const GamePagePres = ({
    firstCard,
    userCardsInHand,
    putCardInPile,
    playerDrawsACard,
    handleCrazyEight,
    isCrazyEight,
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
                {[...Array(8)].map((_, index) => (
                    <Box
                        key={index}
                        component='img'
                        src='https://deckofcardsapi.com/static/img/back.png'
                        alt="card"
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
                        onClick={playerDrawsACard}
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
                    src={firstCard?.cards?.[0]?.image || firstCard?.image}
                    alt='card pool'
                    sx={{
                        ...gamePageStyles.deckOfCardConainer.cardPool
                    }}
                />
            </Container>
            <Container
                sx={{ ...gamePageStyles.userCardStackContainer }}
            >
                {userCardsInHand?.cards?.map((card) => (
                    <Box
                        onClick={() => putCardInPile(card)}
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
                isCrazyEight={isCrazyEight}
                handleCrazyEight={handleCrazyEight}
            />
        </Container>
    )
}
