import { useEffect, useState } from 'react';
import { GamePagePres } from './gamePres';

export const GameContainer = () => {

    const [isDeck, setDeck] = useState({});

    const [cardState, setCardState] = useState({
        topCardInPile: {},
        userCardsInHand: [],
        computersCardsInHand: [],
        cardPileHistory: [],
        deck_id: '',
        remainingCardsInDeck: null,
    })

    const [isSpecialCardSelected, setSpecialCardSelected] = useState({
        crazyEight: {
            condition: false,
            suitSelected: null,
        },
        drawTwo: {
            stacked: false,
        },
        skipOpponentsTurn: false,
    });

    const [whosTurn, setPlayersTurn] = useState({
        user: true,
        computer: false,
    })

    useEffect(() => {
        let cleanUp = false;

        if (!cleanUp) {
            const setupGame = async () => {
                try {
                    console.log('Fetching deck...');

                    // Get a new deck
                    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');

                    if (!response.ok) {
                        console.error(`Error fetching a new deck: ${response.statusText}`);
                        return;
                    }

                    // 'deck' variable will be used for the rest of the subsequent external api fetches.
                    const deck = await response.json();

                    if (!cleanUp) {
                        setDeck(deck);
                    }

                    // Draw 1 card from the deck
                    const firstCardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);

                    if (!firstCardResponse.ok) {
                        console.error(`Error fetching the first card ${firstCardResponse.statusText}`);
                        return;
                    }

                    const firstCard = await firstCardResponse.json();

                    if (!cleanUp) {
                        setCardState(prevState => ({
                            ...prevState,
                            topCardInPile: firstCard.cards[0],
                            deck_id: deck.deck_id,
                        }));
                    }

                    // Draw 8 cards for the user's hand
                    const userHandResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=8`);

                    if (!userHandResponse.ok) {
                        console.error(`Error fetching for users hand ${userHandResponse.statusText}`);
                        return;
                    }

                    const userCards = await userHandResponse.json();

                    console.log('User cards', userCards.cards);

                    if (!cleanUp) {
                        setCardState(prevState => ({
                            ...prevState,
                            remainingCardsInDeck: userCards.remaining,
                            userCardsInHand: userCards.cards
                        }))
                    }

                    // Draw 8 cards for the computer's hand
                    const compHandResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=8`)

                    if (!compHandResponse.ok) {
                        console.error(`Error fetching for computer's hand ${compHandResponse.statusText}`);
                    };

                    const computersCards = await compHandResponse.json();

                    if (!cleanUp) {
                        setCardState(prevState => ({
                            ...prevState,
                            remainingCardsInDeck: userCards.remaining,
                            computersCardsInHand: computersCards.cards
                        }));
                    }

                } catch (error) {
                    console.log(error);
                }
            };

            setupGame();
        }

        return () => {
            cleanUp = true;
        }

    }, []);

    // Uncomment for testing purposes

    // console.log('deck of cards', isDeck);
    // console.log('Top card', cardState.topCardInPile);
    // console.log('users current cards in hand', cardState.userCardsInHand);
    // console.log('computers cards in hand', cardState.computersCardsInHand);
    console.log('whos turn global', whosTurn);
    // console.log('pile history', cardState.cardPileHistory);
    console.log('card state', cardState);
    // console.log('isSpecialCardSelected!', isSpecialCardSelected);

    const gameFunctions = {

        computerResponse: async (suit, value, card) => {
            const currentTurn = whosTurn.user ? 'user' : 'computer';
            console.log('current turn in computer response.', currentTurn);

            console.log({
                message: 'Last card from pile being shown in computerResponse function',
                suit,
                value,
                card,
            });

            const crazyEight = value === '8';
            const drawTwo = value === '2';
            const skipPlayer = value === '4';
            const notASpecialCard = (!crazyEight && !drawTwo && !skipPlayer);

            // const suitUpperCased = suit.toUpperCase();

            if (crazyEight) {
                // This condition excutes when the players plays the 8 card

                const randomlySelectedCard = cardState.computersCardsInHand
                    .filter(card => card.suit === suit)
                [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === suit).length)];

                console.log({
                    randomlySelectedCard,
                    computersCardsInHand: cardState.computersCardsInHand,
                    suitMessage: `Computer has to put down a ${suit} card or pluck from the deck`,
                    message: 'Crazy eight condition ran'
                });

                // setTimeout(() => {

                setCardState(prevState => ({
                    ...prevState,
                    computersCardsInHand: prevState.computersCardsInHand.filter((card) => card !== randomlySelectedCard),
                }));
                gameFunctions.putCardInPile(randomlySelectedCard);

                // }, 1000);

            } else if (drawTwo || skipPlayer) {

                console.log('Computer draws two or skips turn');

                if (drawTwo) {

                } else {

                }

            } else if (notASpecialCard) {
                console.log('Not a special card condition met!');

                if (!whosTurn.computer) {
                    console.log(`Function A is running during ${currentTurn}'s turn (computerResponse)`);

                    setTimeout(() => {
                        const randomlySelectedCard = cardState.computersCardsInHand
                            .filter(card => card.suit === suit || card.value === value)
                        [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === suit || card.value === value).length)];

                        setCardState(prevState => ({
                            ...prevState,
                            topCardInPile: randomlySelectedCard,
                            computersCardsInHand: prevState.computersCardsInHand.filter((card) => card.code !== randomlySelectedCard.code),
                        }));

                        // This is where data will go from Function A to Function B
                        console.log("Data from Function A:", card);
                        console.log('randomly seleted card', randomlySelectedCard)

                        // Simulate a call to Function B with additional parameter
                        gameFunctions.putCardInPile(true, randomlySelectedCard);
                    }, 2000)

                    console.log(`Function A completed during ${currentTurn}'s turn`);
                } else {
                    console.log(`Function A is already in progress during ${currentTurn}'s turn, skipping recursive call`);
                }

            } else {
                return
            }

        },

        handleCrazyEight: (event, reason) => {

            console.log(' handleCrazyEight function event details:', event);
            console.log('inside event', isSpecialCardSelected);

            if (reason === "backdropClick" || reason === "escapeKeyDown") {
                return;
            }

            // Checks if the event object is true and sets the suit selected state accordingly
            if (event) {

                console.log(`event is true: ${event.target.alt}`);

                const suit = event.target.alt;

                const suitUpperCased = suit.toUpperCase();

                setSpecialCardSelected(prevState => ({
                    ...prevState,
                    crazyEight: {
                        ...prevState.crazyEight,
                        suitSelected: suitUpperCased,
                        condition: false,
                    }
                }));
            }

            // const newSuit = event.target.alt
            // gameFunctions.compCardPlayResponses(newSuit, '8');

        },

        putCardInPile: (fromComputer, card) => {
            console.log('Put card in pile function ran');

            const currentTurn = whosTurn.user ? 'user' : 'computer';
            console.log(`Function B is running during ${currentTurn}'s turn`);

            let fromComputers = fromComputer

            console.log('card', card)
            const selectedCard = card;
            const suit = selectedCard.suit;
            const value = selectedCard.value;

            console.log('selected card', selectedCard);

            // Initialized conditions
            const isSameSuit = cardState.topCardInPile.suit === selectedCard.suit;
            const isSameValue = cardState.topCardInPile.value === selectedCard.value;
            const notASpecialCard = selectedCard.value !== '8' && selectedCard.value !== '2' && selectedCard.value !== '4';
            const isCrazyEightClosed = (selectedCard.value === '8');
            const wasCrazyEightOpened = (isSpecialCardSelected.crazyEight.condition) && (isSpecialCardSelected.crazyEight.suitSelected) && (selectedCard.value === '8');
            const drawTwoSelected = (selectedCard.value === '4');
            const skipYouSelected = (selectedCard.value === '2');

            if ((isSameSuit || isSameValue || (isSpecialCardSelected.crazyEight.suitSelected === selectedCard.suit)) && notASpecialCard) {
                // Logic for putting the normal card down.
                console.log('The first if/else conditional ran!');

                // Resets the crazy 8 card state
                setSpecialCardSelected((prevState) => ({
                    ...prevState,
                    crazyEight: {
                        ...prevState.crazyEight,
                        suitSelected: null,
                    },
                }));

                // Perform certain actions based on the state of callInProgress.functionA
                if (fromComputers) {
                    // This is where data will go from Function B to Function A
                    console.log(`Function B received call from Function A during ${currentTurn}'s turn with data:`, selectedCard);

                    fromComputer = true;
                    // gameFunctions.computerResponse(suit, value, selectedCard);
                } else {
                    // This is where data will go from Function B to Function A
                    // Modify or conditionally handle the data here before calling Function A again
                    console.log("Put card in pile function received a regular call by user");

                    setCardState((prevState) => {
                        const updatedUserCardsInHand = prevState.userCardsInHand.filter((card) => card.code !== selectedCard.code);

                        return {
                            ...prevState,
                            topCardInPile: selectedCard,
                            userCardsInHand: updatedUserCardsInHand,
                        };
                    });
                    gameFunctions.computerResponse(suit, value, selectedCard);
                }

            } else if (isCrazyEightClosed) {
                // Logic for opening crazy 8 modal 

                console.log('Opening crazy eight modal');

                setCardState((prevState) => ({
                    ...prevState,
                    topCardInPile: selectedCard,
                    userCardsInHand: prevState.userCardsInHand.filter((card) => card.code !== selectedCard.code),
                }));

                setSpecialCardSelected((prevState) => ({
                    ...prevState,
                    crazyEight: {
                        ...prevState.crazyEight,
                        condition: true,
                        suitSelected: null,
                    },
                }));

            } else if (wasCrazyEightOpened) {
                // Once the modal is opened this logic continues the logic
                console.log({
                    alert: 'Crazy 8 modal was open, now closed from selecting a suit',
                    details: `Suit selected state: ${isSpecialCardSelected.crazyEight.suitSelected}`
                })
                setCardState((prevState) => ({
                    ...prevState,
                    topCardInPile: selectedCard,
                    userCardsInHand: prevState.userCardsInHand.filter((card) => card.code !== selectedCard.code),
                }));
            } else if (drawTwoSelected || skipYouSelected) {
                // Logic for if the player put down a draw 2 or skip card 4
                console.log('2 or 4 was selected!');

                setCardState((prevState) => ({
                    ...prevState,
                    topCardInPile: selectedCard,
                    userCardsInHand: prevState.userCardsInHand.filter((card) => card.code !== selectedCard.code),
                }));
            } else {
                console.log({
                    message: 'returned?',
                    selectedCardSuit: selectedCard.suit,
                    selectedCardValue: selectedCard.value,
                    crazyEightSuit: isSpecialCardSelected.crazyEight.suitSelected,
                    crazyEightCondition: isSpecialCardSelected.crazyEight.condition,
                    topCardInPile: cardState.topCardInPile,
                    whosTurn: whosTurn,
                    isSameSuit: isSameSuit,
                    isSameValue: isSameValue,
                })
                return
            }
            console.log("Put card in data completed during", currentTurn);
        },

        playerDrawsACard: async () => {

            console.log('Player drawing a card');

            if (cardState.remainingCardsInDeck > 0) {

                try {

                    const response = await fetch(`https://deckofcardsapi.com/api/deck/${isDeck.deck_id}/draw/?count=1`);

                    if (!response.ok) {
                        console.error('Failed to draw card from deck');
                    }

                    const card = await response.json();

                    console.log('drawn card', card.cards[0]);

                    if (whosTurn.user) {
                        console.log({
                            message: 'USER drew a card from the deck',
                            whosTurn: whosTurn
                        })

                        setCardState((prevState) => {
                            const updatedUserCardsInHand = [...prevState.userCardsInHand, card.cards[0]];
                            return {
                                ...prevState,
                                remainingCardsInDeck: card.remaining,
                                userCardsInHand: updatedUserCardsInHand,
                            };
                        });

                    } else {
                        console.log({
                            message: 'COMPUTER drew a card from the deck',
                            whosTurn: whosTurn
                        })
                        setCardState((prevState) => {
                            const updatedUserCardsInHand = [...prevState.computersCardsInHand, card.cards[0]];
                            return {
                                ...prevState,
                                remainingCardsInDeck: card.remaining,
                                computersCardsInHand: updatedUserCardsInHand,
                            };
                        });
                    }

                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('Deck is empty please reshuffle. Returned');
                return
            }

            console.log('card state', cardState);

            gameFunctions.computerResponse(cardState.topCardInPile.suit, cardState.topCardInPile.value, cardState.topCardInPile)
        },
    };
    return (
        <GamePagePres

            // Card hands & pile states
            cardState={cardState}

            playerActions={{
                putCardInPile: gameFunctions.putCardInPile,
                playerDrawsACard: gameFunctions.playerDrawsACard,
                handleCrazyEight: gameFunctions.handleCrazyEight,
            }}

            isSpecialCardSelected={isSpecialCardSelected}
        />
    )

}
