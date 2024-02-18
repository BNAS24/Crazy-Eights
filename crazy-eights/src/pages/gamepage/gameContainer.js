import { useEffect, useState } from 'react';
import { GamePagePres } from './gamePres';

export const GameContainer = () => {

    const [newDeck, setNewDeck] = useState({});
    const [firstCard, setFirstCard] = useState({});
    const [userCardsInHand, setUsersCardsInHand] = useState({});
    const [compCardsInHand, setCompCardsInHand] = useState({});
    const [isCrazyEight, setCrazyEight] = useState(false);
    const [isSuitSelected, setSuitSelected] = useState(null);
    const [pileHistory, setPileHistory] = useState([]);
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
        console.log(whosTurn);
    }, [whosTurn]);

    useEffect(() => {
        if(newDeck.length === 0) {
            console.log('Deck being shuffled')
        } else {
            setPileHistory(prevPileHistory => [
                ...prevPileHistory,
                firstCard.code
            ]);
        }

    }, [firstCard, newDeck]);

    // Uncomment for testing purposes

    // console.log('deck of cards', newDeck);
    // console.log('first card', firstCard);
    // console.log('users current cards in hand', userCardsInHand);
    // console.log('computers cards in hand', compCardsInHand);
    // console.log('whos turn global', whosTurn);
    console.log('pile history', pileHistory)

    const gameFunctions = {

        compCardPlayResponses: async (suit, value, card) => {
            console.log({
                message: 'Last card from pile being shown in computerResponse function',
                suit,
                value,
                card,
            });

            const suitUpperCased = suit.toUpperCase();

            if (suitUpperCased && value === '8') {

                const randomlySelectedCard = compCardsInHand.cards
                    .filter(card => card.suit === suitUpperCased)
                [Math.floor(Math.random() * compCardsInHand.cards.filter(card => card.suit === suitUpperCased).length)];

                console.log({
                    randomlySelectedCard,
                    computersCardsInHand: compCardsInHand,
                });

                const updatedCompCardsInHandState = {
                    ...compCardsInHand,
                    cards: compCardsInHand.cards.filter((card) => card !== randomlySelectedCard),
                };

                const suitMessage = `Computer has to put down a ${suit} card or pluck from the deck`;
                console.log(suitMessage);

                setTimeout(() => {

                    setCompCardsInHand(updatedCompCardsInHandState);

                    gameFunctions.putCardInPile(randomlySelectedCard);

                }, 1000);

            } else if (value === '2' || value === '4') {

                // Adjust count based on the value
                const drawCardsCount = value === '2' ? 2 : 0;

                if (drawCardsCount > 0) {

                    try {

                        const response = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=${drawCardsCount}`);

                        if (!response.ok) {
                            console.error('Failed to draw cards from the deck');
                        }

                        const cards = await response.json();

                        setTimeout(() => {
                            setCompCardsInHand((prevCompCardsInHand) => ({
                                ...prevCompCardsInHand,
                                cards: [...prevCompCardsInHand.cards, ...cards.cards],
                            }));
                        }, 2000);

                        console.log(`The opponent has to draw ${drawCardsCount} card${drawCardsCount > 1 ? 's' : ''}!`);

                    } catch (error) {
                        console.error('Error fetching or processing cards:', error);
                    }
                } else if (value === '4') {

                    console.log('The opponent is skipped!');

                } else {

                    console.log('Something went wrong in this switch');

                }
            } else if (value !== '8' && value !== '2' && value !== '4') {

                setTimeout(() => {
                    console.log({
                        message: 'Card reached the right conditional statement',
                        card,
                    });

                    const randomlySelectedCard = compCardsInHand.cards
                        .filter(card => card.suit === suitUpperCased || card.value === value)
                    [Math.floor(Math.random() * compCardsInHand.cards.filter(card => card.suit === suitUpperCased || card.value === value).length)];

                    if (randomlySelectedCard === undefined) {
                        // Handle the case when there are no matching cards
                        console.log('There were no matching cards in hand');
                        gameFunctions.playerDrawsACard();
                        return;
                    }

                    console.log({
                        message1: `Computer looks for ${suit} or ${value} in hand`,
                        message2: `Randomly selected card: ${randomlySelectedCard.code}`,
                    });

                    const updatedCompCardsInHandState = {
                        ...compCardsInHand,
                        cards: compCardsInHand.cards.filter((card) => card !== randomlySelectedCard),
                    };

                    setCompCardsInHand(updatedCompCardsInHandState);

                    setFirstCard(randomlySelectedCard);
                    switch (suit) {
                        case 'HEARTS':
                        case 'DIAMONDS':
                        case 'SPADES':
                        case 'CLUBS':
                            console.log(`${suit} switch case met`);
                            console.log('computer cards in hand', compCardsInHand);
                            break;
                        default:
                            console.log(`No suit available: ${suit}`);
                    }
                }, 2000);

            }

            // Put logic above this line
            setTimeout(() => {
                setTurn({
                    user: true,
                    computer: false,
                });
                console.log('Computer played card!');
            }, 3000);
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
            // // Stops the player from pressing multiple cards when it's the computers turn
            if (whosTurn.computer) {
                return;
            }

            setTurn({
                user: false,
                computer: true,
            });

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

            } else if ((selectedCard.value === '8') && (isSuitSelected === null)) {

                console.log('Opening crazy eight modal (putCardInPile 2nd else if)');

                setCrazyEight(true);

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
                console.log('putCardInPile() final "else if" called. Triggering computer response.');

                // Sets the suit to null to remove the crazy eight suit text that is next to the card in the pile
                setSuitSelected(null);

                // Add a new card to the pile the goes on top of the previous card put down
                if (whosTurn.computer === false) {
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
            console.log('Player drawing a card')
            try {

                const response = await fetch(`https://deckofcardsapi.com/api/deck/${newDeck.deck_id}/draw/?count=1`);

                if (!response.ok) {
                    console.error('Failed to draw card from deck');
                }

                const card = await response.json();
                console.log('drawn card', card)
                if (whosTurn.user) {
                    console.log({
                        message: 'USER drew a card from the deck',
                        whosTurn: whosTurn
                    })
                    setUsersCardsInHand((prevUserCardsInHand) => {
                        return {
                            ...prevUserCardsInHand,
                            cards: [...prevUserCardsInHand.cards, card.cards[0]],
                        };
                    });
                } else {
                    console.log({
                        message: 'COMPUTER drew a card from the deck',
                        whosTurn: whosTurn
                    })
                    setCompCardsInHand((prevCompCardsInHand) => {
                        return {
                            ...prevCompCardsInHand,
                            cards: [...prevCompCardsInHand.cards, card.cards[0]],
                        };
                    })
                }

            } catch (error) {
                console.log(error);
            }
            setTurn({
                user: false,
                computer: true,
            });
            // console.log('player card function', firstCard.cards[0].suit, firstCard.cards[0].value, firstCard.cards[0])
            // gameFunctions.compCardPlayResponses(firstCard.cards[0].suit, firstCard.cards[0].value, firstCard.cards[0])
            if (!firstCard) {
                gameFunctions.compCardPlayResponses(firstCard.cards[0].suit, firstCard.cards[0].value, firstCard.cards[0])
            }
            else {
                gameFunctions.compCardPlayResponses(firstCard.suit, firstCard.value, firstCard)
            }            
        },
    };

    return (
        <GamePagePres

            // Card hands & pile states
            cards={{
                firstCard: firstCard,
                userCardsInHand: userCardsInHand,
                compCardsInHand: compCardsInHand,
            }}

            // Game actions
            playerActions={{
                putCardInPile: gameFunctions.putCardInPile,
                playerDrawsACard: gameFunctions.playerDrawsACard,
                handleCrazyEight: gameFunctions.handleCrazyEight,
            }}

            // Crazy Eights modal state
            crazyEightState={{
                isCrazyEight: isCrazyEight,
                isSuitSelected: isSuitSelected,
            }}
        />
    )
}
