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


    // console.log('deck of cards', newDeck);
    // console.log('first card', firstCard);
    // console.log('users current cards in hand', userCardsInHand);
    // console.log('computers cards in hand', compCardsInHand);
    // console.log('whos turn global', whosTurn);

    const gameFunctions = {

        compCardPlayResponses: async (suit, value, card) => {

            console.log('Last card from pile being shown in computerResponse function', card)

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

            if ((value !== '8') && (value !== '2') && (value !== '4')) {
                console.log(`Card reached the right conditional statement: ${card}`)
                // const findMatchingSuit = compCardsInHand.cards.filter(card => card.suit === suitUpperCase);
                const findMatchingSuit = compCardsInHand.cards.filter(card => card.suit === suitUpperCase || card.value === value);

                const randomIndex = Math.floor(Math.random() * findMatchingSuit.length);
                const randomlySelectedCard = findMatchingSuit[randomIndex];

                console.log(`Computer looks for ${suit} or ${value} in hand`);
                console.log('Randomly selected card:', randomlySelectedCard);

                const updatedCompCardsInHandState = {
                    ...compCardsInHand,
                    cards: compCardsInHand.cards.filter((card) => card !== randomlySelectedCard),
                };

                setCompCardsInHand(updatedCompCardsInHandState)

                switch (suit) {
                    case 'HEARTS':
                        setTimeout(() => {
                            setFirstCard(randomlySelectedCard)
                        }, 2000)
                        console.log('hearts switch case met');
                        console.log('compuer cards in hand', compCardsInHand)
                        break;
                    case 'DIAMONDS':
                        setTimeout(() => {
                            setFirstCard(randomlySelectedCard)
                        }, 2000)
                        console.log('diamonds switch case met');
                        console.log('compuer cards in hand', compCardsInHand)
                        break;
                    case 'SPADES':
                        setTimeout(() => {
                            setFirstCard(randomlySelectedCard)
                        }, 2000)
                        console.log('spades switch case met');
                        console.log('compuer cards in hand', compCardsInHand)
                        break;
                    case 'CLUBS':
                        setTimeout(() => {
                            setFirstCard(randomlySelectedCard)
                        }, 2000)
                        console.log('clubs switch case met');
                        console.log('compuer cards in hand', compCardsInHand)
                        break;
                    default:
                        console.log(`No suit available: ${suit}`);
                }
            };

            // Logic above this line
            setTimeout(() => {
                setTurn((prevTurn) => ({
                    user: !prevTurn.user,
                    computer: !prevTurn.computer,
                }));
                console.log('Computer played card!');
            }, 3000)
        },

        handleCrazyEight: (event, reason) => {

            console.log(' handleCrazyEight function event details:', event);

            if (reason === "backdropClick" || reason === "escapeKeyDown") {
                return;
            }

            // Checks if the event object is true and sets the suit selected state accordingly
            if (event) {
                console.log(`event is true: ${event.target.alt}`);
                setSuitSelected(event.target.alt);
            }

            const newSuit = event.target.alt

            setCrazyEight(!isCrazyEight);

            gameFunctions.compCardPlayResponses(newSuit, '8');

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

                // const suit = event.target.suit

                // gameFunctions.compCardPlayResponses(suit);

            } else if ((selectedCard.value === '8') && (isSuitSelected === null)) {

                console.log('Opening crazy eight modal (putCardInPile 2nd else if)');

                setCrazyEight(true);

                // setSuitSelected(null);

                // gameFunctions.handleCrazyEight(event);

                setFirstCard(selectedCard);

                const updatedHandState = {
                    ...userCardsInHand,
                    cards: userCardsInHand.cards.filter((card) => (card.code) !== (selectedCard.code)),
                };

                setUsersCardsInHand(updatedHandState);

            } else if (
                ((firstCard.cards?.[0]?.suit || firstCard.suit) === selectedCard.suit) ||
                ((firstCard.cards?.[0]?.value || firstCard.value) === selectedCard.value) ||
                ((isSuitSelected && (whosTurn.computer === true)))
            ) {
                // console.log('isSuitSelected', isSuitSelected);
                // console.log('whos turn', whosTurn);
                console.log('putCardInPile() final "else if" called. Triggering computer response.');

                // Sets the suit to null to remove the crazy eight suit text that is next to the card in the pile
                setSuitSelected(null);

                // Add a new card to the pile the goes on top of the previous card put down
                if (!whosTurn.computer) {
                    setFirstCard(selectedCard);

                    // find the card in the user's hand *state* and removes it
                    const updatedHandState = {
                        ...userCardsInHand,
                        cards: userCardsInHand.cards.filter((card) => card.code !== selectedCard.code),
                    };

                    // Sets the new state that removes the card from the user's hand 
                    setUsersCardsInHand(updatedHandState);

                    // Calls the comp function so the computer can respond to the action.
                    gameFunctions.compCardPlayResponses(card.suit, selectedCard.value, card);
                }

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
