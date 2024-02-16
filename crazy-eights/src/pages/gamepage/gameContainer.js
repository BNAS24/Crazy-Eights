import { useEffect, useState } from 'react';
import { GamePagePres } from './gamePres';

export const GameContainer = () => {

    const [newDeck, setNewDeck] = useState({});
    const [firstCard, setFirstCard] = useState({});
    const [userCardsInHand, setUsersCardsInHand] = useState({});
    const [compCardsInHand, setCompCardsInHand] = useState({});
    const [isCrazyEight, setCrazyEight] = useState(false);
    const [isSuitSelected, setSuitSelected] = useState(null);
    const [whosTurn, setTurn] = useState({
        user: true,
        computer: false,
    });

    useEffect(() => {
        const setupGame = async () => {
            try {
                // Create a new deck
                const response = await fetch('https://deckofcardsapi.com/api/deck/new/');

                if (!response.ok) {
                    console.error(`Error fetching a new deck: ${response.statusText}`);
                    return;
                }

                const deck = await response.json();

                //Shuffle the new deck
                const shuffleResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);

                if (!shuffleResponse.ok) {
                    console.error(`Error shuffling deck: ${shuffleResponse.statusText}`);
                    return;
                }

                const shuffledDeck = await shuffleResponse.json();

                setNewDeck(shuffledDeck);

                // Draw 1 card from the deck
                const firstCardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${shuffledDeck.deck_id}/draw/?count=1`);

                if (!firstCardResponse.ok) {
                    console.error(`Error fetching the first card ${firstCardResponse.statusText}`);
                    return;
                }

                const firstCardData = await firstCardResponse.json();

                setFirstCard(firstCardData);

                // Draw 8 cards for the user's hand
                const userHandResponse = await fetch(`https://deckofcardsapi.com/api/deck/${shuffledDeck.deck_id}/draw/?count=8`);

                if (!userHandResponse.ok) {
                    console.error(`Error fetching for users hand ${userHandResponse.statusText}`);
                    return;
                }

                const userHand = await userHandResponse.json();

                setUsersCardsInHand(userHand);

                // Draw 8 cards for the computer's hand
                const compHandResponse = await fetch(`https://deckofcardsapi.com/api/deck/${shuffledDeck.deck_id}/draw/?count=8`)

                if (!compHandResponse.ok) {
                    console.error(`Error fetching for computer's hand ${compHandResponse.statusText}`);
                };

                const compHand = await compHandResponse.json();

                setCompCardsInHand(compHand);

            } catch (error) {
                console.log(error);
            }
        };

        setupGame();

    }, []);

    useEffect(() => {
        if ((isCrazyEight !== true) && isSuitSelected) {
            compCardPlayResponses(isSuitSelected, '8');
        }

    }, [isCrazyEight, isSuitSelected]);

    // console.log('deck of cards', newDeck);
    // console.log('first card', firstCard);
    // console.log('users current cards in hand', userCardsInHand);
    // console.log('computers cards in hand', compCardsInHand);

    const compCardPlayResponses = async (suit, value) => {

        setTurn((prevTurn) => ({
            user: !prevTurn.user,
            computer: !prevTurn.computer,
        }));

        const suitUpperCase = suit.toUpperCase();

        if (suitUpperCase && (value === '8')) {
            const findMatchingSuit = compCardsInHand.cards.filter(card => card.suit === suitUpperCase);
            const randomIndex = Math.floor(Math.random() * findMatchingSuit.length);
            const randomlySelectedCard = findMatchingSuit[randomIndex];

            console.log('Randomly selected card:', randomlySelectedCard);
            console.log('compuer cards in hand', compCardsInHand)

            const updatedCompCardsInHandState = {
                ...compCardsInHand,
                cards: compCardsInHand.cards.filter((card) => card !== randomlySelectedCard),
            };

            switch (suitUpperCase) {
                case 'HEARTS':
                    console.log(`Computer has to put down a ${suit} card or pluck from the deck`);
                    setTimeout(() => {
                        setCompCardsInHand(updatedCompCardsInHandState)

                        gameFunctions.putCardInPile(randomlySelectedCard);
                    }, 1000)
                    break;
                case 'DIAMONDS':
                    console.log(`Computer has to put down a ${suit} card or pluck from the deck`);
                    setTimeout(() => {
                        setCompCardsInHand(updatedCompCardsInHandState)

                        gameFunctions.putCardInPile(randomlySelectedCard);
                    }, 1000)
                    break;
                case 'SPADES':
                    console.log(`Computer has to put down a ${suit} card or pluck from the deck`);
                    setTimeout(() => {
                        setCompCardsInHand(updatedCompCardsInHandState)

                        gameFunctions.putCardInPile(randomlySelectedCard);
                    }, 1000)
                    break;
                case 'CLUBS':
                    console.log(`Computer has to put down a ${suit} card or pluck from the deck`);
                    setTimeout(() => {
                        setCompCardsInHand(updatedCompCardsInHandState)

                        gameFunctions.putCardInPile(randomlySelectedCard);
                    }, 1000)
                    break;
                default:
                    console.log(`something went wrong in this switch`);
            }
        }

        if (value === '2' || value === '4') {
            switch (value) {
                case '2':
                    console.log('The oppenet has to draw 2!');
                    break;
                case '4':
                    console.log('The oppenent is skipped!');
                    break;
                default:
                    console.log(`something went wrong in this switch`);
            }
        }

        if (value !== '8' && (value !== '2' && value !== '4')) {
            switch (suit) {
                case 'HEARTS':
                    console.log(`Computer looks for heart or ${value} in hand`);
                    break;
                case 'DIAMONDS':
                    console.log(`Computer looks for diamond or ${value} in hand`);
                    break;
                case 'SPADES':
                    console.log(`Computer looks for spades or ${value} in hand`);
                    break;
                case 'CLUBS':
                    console.log(`Computer looks for clubs or ${value} in hand`);
                    break;
                default:
                    console.log(`No suit available: ${suit}`);
            }
        };

        console.log('Computer thinking...');

        // Logic above this line
        setTimeout(() => {
            // Add logic above this line
            setTurn((prevTurn) => ({
                user: !prevTurn.user,
                computer: !prevTurn.computer,
            }));
            console.log('Computer played card!');
        }, 3000)
    }

    const gameFunctions = {

        handleCrazyEight: (event, reason) => {
            if (reason === "backdropClick" || reason === "escapeKeyDown") {
                return;
            }

            // Checks if the event object is true and sets the suit selected state accordingly
            if (event) {
                setSuitSelected(event.target.alt);
            }

            setCrazyEight(!isCrazyEight);

            // compCardPlayResponses(isSuitSelected, '8')
        },

        putCardInPile: (card, event) => {
            // Stops the player from pressing multiple cards when it's the computers turn
            // if (whosTurn.computer) {
            //     return;
            // }
            const selectedCard = card;

            if (isSuitSelected !== null && selectedCard.value === '8' && isCrazyEight === true) {

                console.log('First condition selected');

                console.log('Suit selected state:', isSuitSelected);

                setFirstCard(selectedCard);

                const updatedHandState = {
                    ...userCardsInHand,
                    cards: userCardsInHand.cards.filter((card) => (card.code) !== (selectedCard.code)),
                };

                setUsersCardsInHand(updatedHandState);

                const suit = event.target.suit
                compCardPlayResponses(suit);

            } else if (selectedCard.value === '8') {

                setSuitSelected(null);

                gameFunctions.handleCrazyEight(event);

                setFirstCard(selectedCard);

                const updatedHandState = {
                    ...userCardsInHand,
                    cards: userCardsInHand.cards.filter((card) => (card.code) !== (selectedCard.code)),
                };

                setUsersCardsInHand(updatedHandState);

            } else if (
                ((firstCard.cards?.[0]?.suit || firstCard.suit) === selectedCard.suit) ||
                ((firstCard.cards?.[0]?.value || firstCard.value) === selectedCard.value) ||
                ((isSuitSelected && (whosTurn.computer !== true))) // Logic to the left isnt good because the computer turn should be true when its deciding
            ) {
                console.log('crazy 8 reponded')
                setSuitSelected(null);

                // Conditional logic for when a card is either a 2 or 4 will put here
                setFirstCard(selectedCard);

                const updatedHandState = {
                    ...userCardsInHand,
                    cards: userCardsInHand.cards.filter((card) => card.code !== selectedCard.code),
                };

                setUsersCardsInHand(updatedHandState);

                compCardPlayResponses(card.suit, selectedCard.value);

            } else {
                return;
            }
        },

        playerDrawsACard: async () => {
            try {

                const response = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=1`);

                if (!response.ok) {
                    console.error('Failed to draw card from deck');
                }

                const card = await response.json();

                setUsersCardsInHand((prevUserCardsInHand) => {
                    return {
                        ...prevUserCardsInHand,
                        cards: [...prevUserCardsInHand.cards, card.cards[0]],
                    };
                });

            } catch (error) {
                console.log(error);
            }
        },
    };

    return (
        <GamePagePres
            cards={{
                firstCard: firstCard,
                userCardsInHand: userCardsInHand,
                compCardsInHand: compCardsInHand,
            }}

            playerActions={{
                putCardInPile: gameFunctions.putCardInPile,
                playerDrawsACard: gameFunctions.playerDrawsACard,
                handleCrazyEight: gameFunctions.handleCrazyEight,
            }}

            crazyEightState={{
                isCrazyEight: isCrazyEight,
                isSuitSelected: isSuitSelected,
            }}
        />
    )
}
