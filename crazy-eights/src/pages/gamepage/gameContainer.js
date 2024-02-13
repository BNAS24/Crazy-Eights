import { GamePagePres } from './gamePres'
import { useEffect, useState } from 'react'

export const GameContainer = () => {

    const [newDeck, setNewDeck] = useState({});
    const [firstCard, setFirstCard] = useState({});
    const [userCardsInHand, setUsersCardsInHand] = useState({});
    const [isCrazyEight, setCrazyEight] = useState(false);

    useEffect(() => {
        const setupGame = async () => {
            try {
                const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
                if (!response.ok) {
                    console.error(`Error fetching a new deck: ${response.statusText}`);
                    return;
                }

                const deck = await response.json();

                const shuffleResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);

                if (!shuffleResponse.ok) {
                    console.error(`Error shuffling deck: ${shuffleResponse.statusText}`);
                    return;
                }

                const shuffledDeck = await shuffleResponse.json();

                setNewDeck(shuffledDeck);

                const firstCardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${shuffledDeck.deck_id}/draw/?count=1`);

                if (!firstCardResponse.ok) {
                    console.error(`Error fetching the first card ${firstCardResponse.statusText}`);
                    return;
                }

                const firstCardData = await firstCardResponse.json();

                setFirstCard(firstCardData);

                const userHandResponse = await fetch(`https://deckofcardsapi.com/api/deck/${shuffledDeck.deck_id}/draw/?count=8`);

                if (!userHandResponse.ok) {
                    console.error(`Error fetching for users hand ${userHandResponse.statusText}`);
                    return;
                }

                const userHand = await userHandResponse.json()

                setUsersCardsInHand(userHand);

            } catch (error) {
                console.log(error);
            }
        };

        setupGame();

    }, []);

    // console.log('deck of cards', newDeck);
    // console.log('first card', firstCard);
    // console.log('users current cards in hand', userCardsInHand);

    const handleCrazyEight = () => setCrazyEight(!isCrazyEight);

    // Below this line i'm planning on grouping these functions into an object one all the functionality is implemented to keep the logic all together and easy to read, use, and understand.

    // Removes a card from the player's hand and places it in the pile
    const putCardInPile = (card) => {

        const selectedCard = card;

        if (selectedCard.value === '8') {

            // Logic for when a card is 8

            // Ends above this line

            handleCrazyEight();

            setFirstCard(selectedCard);


            const updatedHandState = {
                ...userCardsInHand,
                cards: userCardsInHand.cards.filter((card) => (card.code) !== (selectedCard.code)),
            };

            setUsersCardsInHand(updatedHandState);

        } else if (
            ((firstCard.cards?.[0]?.suit || firstCard.suit) === selectedCard.suit) ||
            ((firstCard.cards?.[0]?.value || firstCard.value) === selectedCard.value)
        ) {

            // Conditional logic for when a card is either a 2 or 4 will put here 


            // Ends above this line

            setFirstCard(selectedCard);

            const updatedHandState = {
                ...userCardsInHand,
                cards: userCardsInHand.cards.filter((card) => card.code !== selectedCard.code),
            };

            setUsersCardsInHand(updatedHandState);

        } else {
            return;
        }

    };

    const playerDrawsACard = async () => {
        try {
            const response = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=1`);

            if (!response.ok) {
                console.error('Failed to draw card from deck');
            }

            const card = await response.json();

            console.log('card', card);

            // Add card to players hand
            setUsersCardsInHand((prevUserCardsInHand) => {
                return {
                    ...prevUserCardsInHand,
                    cards: [...prevUserCardsInHand.cards, card.cards[0]],
                };
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <GamePagePres
            firstCard={firstCard}
            userCardsInHand={userCardsInHand}
            putCardInPile={putCardInPile}
            playerDrawsACard={playerDrawsACard}
            handleCrazyEight={handleCrazyEight}
            isCrazyEight={isCrazyEight}
        />
    )
}
