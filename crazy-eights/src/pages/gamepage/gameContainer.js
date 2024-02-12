import { GamePagePres } from './gamePres'
import { useEffect, useState } from 'react'

export const GameContainer = () => {

    const [newDeck, setNewDeck] = useState({});
    const [firstCard, setFirstCard] = useState({});
    const [userCardsInHand, setUsersCardsInHand] = useState({});

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

                const userHand = await userHandResponse.json();
                setUsersCardsInHand(userHand);
            } catch (error) {
                console.log(error);
            }
        };

        setupGame();
    }, []);

    console.log('deck of cards', newDeck);
    console.log('first card', firstCard);
    console.log('users hand', userCardsInHand);

    return (
        <GamePagePres
            firstCard={firstCard}
            userCardsInHand={userCardsInHand}
        />
    )
}
