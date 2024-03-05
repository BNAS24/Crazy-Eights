import { useEffect, useState, useRef } from 'react';
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
    });

    const [crazyEight, setCrazyEight] = useState(false);

    // Global variable using useRef to keep track of card values for computer to make decisions and to hold immediately updated values.
    const usersTurn = useRef(true);
    const suitSelected = useRef(null);
    const cardResolved = useRef(true);
    const cardOnTop = useRef(null);

    useEffect(() => {
        let cleanUp = false;

        if (!cleanUp) {
            const setupGame = async () => {
                try {
                    // console.log('Fetching deck...');

                    // Get a new deck
                    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');

                    if (!response.ok) {
                        console.error(`Error fetching a new deck: ${response.statusText}`);
                        return;
                    };

                    // 'deck' variable will be used for the rest of the subsequent external api fetches.
                    const deck = await response.json();

                    if (!cleanUp) {
                        setDeck(deck);
                    };

                    // Draw 1 card from the deck
                    const firstCardResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);

                    if (!firstCardResponse.ok) {
                        console.error(`Error fetching the first card ${firstCardResponse.statusText}`);
                        return;
                    };

                    const firstCard = await firstCardResponse.json();

                    if (!cleanUp) {
                        setCardState(prevState => ({
                            ...prevState,
                            topCardInPile: firstCard.cards[0],
                            cardPileHistory: [...prevState.cardPileHistory, ...firstCard.cards],
                            deck_id: deck.deck_id,
                        }));

                        cardOnTop.current = firstCard.cards[0]
                    };

                    // Draw 8 cards for the user's hand
                    const userHandResponse = await fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=8`);

                    if (!userHandResponse.ok) {
                        console.error(`Error fetching for users hand ${userHandResponse.statusText}`);
                        return;
                    };

                    const userCards = await userHandResponse.json();

                    if (!cleanUp) {
                        setCardState(prevState => ({
                            ...prevState,
                            remainingCardsInDeck: userCards.remaining,
                            userCardsInHand: userCards.cards
                        }))
                    };

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
                    };

                } catch (error) {
                    console.log(error);
                };
            };

            setupGame();
        }

        return () => {
            cleanUp = true;
        }

    }, []);

    console.log('card state', cardState);

    const drawTwoCards = async (stateName) => {

        try {

            const response = await fetch(`https://deckofcardsapi.com/api/deck/${isDeck.deck_id}/draw/?count=2`);

            if (!response.ok) {
                console.error('Failed to draw cards from deck');
            }

            const cards = await response.json();

            setCardState(prevState => ({
                ...prevState,
                remainingCardsInDeck: cards.remaining,
                [stateName]: [...prevState[stateName], ...cards.cards],
            }));

        } catch (error) {
            console.log(error);
        }
    };

    const drawACard = async (stateName) => {

        try {

            const response = await fetch(`https://deckofcardsapi.com/api/deck/${isDeck.deck_id}/draw/?count=1`);

            if (!response.ok) {
                console.error('Failed to draw card from deck');
            };

            const card = await response.json();

            console.log('drawn card', card.cards[0]);

            setCardState(prevState => ({
                ...prevState,
                remainingCardsInDeck: card.remaining,
                [stateName]: [...prevState[stateName], ...card.cards],
            }));

        } catch (error) {
            console.log(error);
        }

    };

    /* Variable that will check if the user has to obey the rules
of the current top card in the pile or continue to play as normal*/
    // let usersTurn = true;
    // let suitSelected = null;
    // let cardResolved = true;

    const gameFunctions = {
        handleUserTurn: (card, pluck) => {
            console.log('User made a decision during their turn');

            const plucked = pluck;

            // Plucking a card instead of selecting a card
            if (plucked) {
                gameFunctions.gameLogic.drawCards(false, false);
                gameFunctions.computerResponse(cardState.topCardInPile);
            };

            // Selecting  a card logic
            if (usersTurn.current && !plucked) {
                const selectedCard = card;

                // Captures the value of the function and stores it in a variable
                const cardAndSate = gameFunctions.gameLogic.checkCards(selectedCard);

                console.log('checkCards returned value:', cardAndSate);

                // Uses the value from cardAndState to make a decision.
                if (cardAndSate === 'normal') {
                    // Calls the function that puts down card in pile.
                    gameFunctions.gameLogic.playACard(false, selectedCard);

                    // Resets card state
                    suitSelected.current = null;
                    cardResolved.current = true;

                    // Sets the state to the computers turn
                    usersTurn.current = false;

                    console.log('usersTurn', usersTurn);

                    //Calls the function for the user to respond to the users play decision.
                    gameFunctions.computerResponse(selectedCard); // I might want to use the actual selected card variable to make sure the state is updated fast enough

                } else if (cardAndSate === 'crazyEight') {
                    // Calls the function that puts down card in pile.
                    gameFunctions.gameLogic.playACard(false, selectedCard);

                    //Open crazyEight modal
                    setCrazyEight(true);

                } else if (cardAndSate === 'drawTwo') {

                    // Place the card down in the pile
                    gameFunctions.gameLogic.playACard(false, selectedCard);

                    // Make the computer draw two
                    gameFunctions.gameLogic.drawCards(false, true);

                } else if (cardAndSate === 'skipPlayer') {

                    console.log('User skipped computers turn');

                    gameFunctions.gameLogic.playACard(false, selectedCard);

                    // Resets card state
                    suitSelected.current = null;
                    cardResolved.current = true;

                } else if (cardAndSate === 'pluck') {

                    console.log('Card doesnt match user either needs a card that matches or pluck from the deck');
                    // gameFunctions.gameLogic.drawCards(false, false);

                } else {
                    console.log({
                        message: 'return?',
                        card: card,
                        cardAndSate: cardAndSate,
                    });
                };
            } else {
                console.error('Action forbidden, computers turn');
                return;
            };
        },
        computerResponse: (card, paramSuitSelected) => {
            console.log('Computer made a decision during their turn');

            const cardInPile = card;
            const suit = cardInPile?.suit;
            const value = cardInPile?.value;

            let randomlySelectedCard;
            let cardMatchedWithSuit;

            if (!usersTurn.current) {
                // Logic to select a card a card
                if (card) {
                    randomlySelectedCard = cardState.computersCardsInHand
                        .filter(card => card.suit === suit || card.value === value || card.value === '8')
                    [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === suit ||
                        card.value === value).length)];

                    console.log('Randomly selected card', randomlySelectedCard);
                } else {
                    cardMatchedWithSuit = cardState.computersCardsInHand
                        .filter(card => card.suit === paramSuitSelected)
                    [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === paramSuitSelected).length)];

                    console.log('Card matched with suit', cardMatchedWithSuit);
                };

                // Card checked that user put down in the pile.
                if (randomlySelectedCard) {

                    const cardAndState = gameFunctions.gameLogic.checkCards(randomlySelectedCard);

                    console.log('checkCards returned value (computer):', cardAndState);

                    if (cardAndState === 'normal') {
                        // Calls the function that puts down card in pile.
                        gameFunctions.gameLogic.playACard(true, randomlySelectedCard);

                        // Resets card state
                        suitSelected.current = null;
                        cardResolved.current = true;

                        // Sets the state back to users turn
                        usersTurn.current = true;

                    } else if (cardAndState === 'crazyEight') {
                        // Calls the function that puts down card in pile.
                        gameFunctions.gameLogic.playACard(true, randomlySelectedCard);

                        //Open crazyEight modal
                        setCrazyEight(true);

                        const crazyEightSelections = ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS'];

                        const selectedSuit = crazyEightSelections[Math.floor(Math.random() * crazyEightSelections.length)];

                        // const reason = 'backdropClick';

                        gameFunctions.gameLogic.handleCrazyEight(true, selectedSuit);

                        console.log('suitSelected', suitSelected);

                    } else if (cardAndState === 'drawTwo') {

                        cardResolved.current = false;

                        // Places the card down
                        gameFunctions.gameLogic.playACard(true, randomlySelectedCard);

                        // Computer makes the user draw two cards
                        gameFunctions.gameLogic.drawCards(true, true);

                        // Computer get another turn to make a decision
                        // gameFunctions.computerResponse(randomlySelectedCard);

                        cardResolved.current = true;
                        usersTurn.current = true;

                    } else if (cardAndState === 'skipPlayer') {

                        console.log('User skipped, computers turn');

                        gameFunctions.gameLogic.playACard(true, randomlySelectedCard);

                        usersTurn.current = false;

                    } else if (cardAndState === 'pluck') {

                        console.log('Computer needs to pluck from the deck');
                        // gameFunctions.gameLogic.drawCards(false, false);

                    } else {
                        console.log({
                            message: 'return?',
                            card: card,
                            cardAndSate: cardAndState,
                        });
                    };

                } else if (cardMatchedWithSuit) {
                    // Send the card that matches the crazy suit to get checked by the middleware function
                    const cardAndState = gameFunctions.gameLogic.checkCards(cardMatchedWithSuit);

                    console.log('checkCards returned value for matching suit (computer):', cardAndState);

                    if (cardAndState === 'normal') {
                        // Play the card
                        gameFunctions.gameLogic.playACard(true, cardMatchedWithSuit);

                        // Sets the suit selected state back to normal
                        suitSelected.current = null;
                        cardResolved.current = true;
                        usersTurn.current = true;

                    } else if (cardAndState === 'crazyEight') {
                        // Play the card
                        gameFunctions.gameLogic.playACard(true, cardMatchedWithSuit);

                        // Sets the suit selected state back to normal
                        suitSelected.current = null;
                        cardResolved.current = false;

                    } else if (cardAndState === 'drawTwo') {

                        cardResolved.current = false;

                        gameFunctions.gameLogic.playACard(randomlySelectedCard);

                        // Computer makes the user draw two cards
                        gameFunctions.gameLogic.drawCards(true, true);

                        // Computer get another turn to make a decision
                        // gameFunctions.computerResponse(randomlySelectedCard);

                        // Sets the suit selected state back to normal
                        suitSelected.current = null;
                        cardResolved.current = true;

                    } else if (cardAndState === 'skipPlayer') {

                        console.log('User skipped, computers turn');

                        gameFunctions.gameLogic.playACard(true, randomlySelectedCard);

                        usersTurn.current = false;

                        setTimeout(() => {
                            gameFunctions.computerResponse(randomlySelectedCard);
                        }, 1000);

                    } else if (cardAndState === 'pluck') {

                        console.log('Computer needs to pluck from the deck');

                        gameFunctions.gameLogic.drawCards(true, false);

                    };
                } else if ((randomlySelectedCard || cardMatchedWithSuit) === undefined) {
                    // Logic for when the computer cant find a matching card inside the deck.

                    gameFunctions.gameLogic.drawCards(true, false);

                    usersTurn.current = true;
                };
                // Logic to 
            } else {
                console.error('Action forbidden, users turn');
                return;
            };
        },
        gameLogic: {
            checkCards: (card) => {
                /* This will basically check the state of the card 
                being played and the state of the game. Will be the 
                middle function between a players decision and the action 
                being done.*/
                console.log('Checking cards...');

                const selectedCard = card;
                const topCardInPile = cardState.topCardInPile;
                const suitMatches = selectedCard.suit === cardOnTop.current.suit;
                const crazyEightSuitMatches = suitSelected.current === selectedCard.suit;
                const valueMatches = selectedCard.value === cardOnTop.current.value;
                const crazyEight = selectedCard.value === '8';
                const skipPlayer = selectedCard.value === '4';
                const drawTwo = selectedCard.value === '2';
                const aSpecialCard = ['2', '4', '8'].includes(selectedCard.value);

                if ((!aSpecialCard && (suitMatches || valueMatches) && cardResolved.current) ||
                    (!aSpecialCard && crazyEightSuitMatches && !cardResolved.current)) {
                    // Logic for normal card
                    console.log(`${selectedCard.code} clears the normal card logic.`);

                    return 'normal';

                } else if (crazyEight) {
                    // Logic for crazy 8 card
                    console.log(`${selectedCard.code} clears the crazy eight card logic.`);

                    return 'crazyEight';

                } else if ((drawTwo && (valueMatches || suitMatches)) || (drawTwo && crazyEightSuitMatches && !cardResolved.current)) {

                    // Logic for card with the value of two
                    console.log(`${selectedCard.code} clears the draw two card logic.`);

                    // Return statement
                    return 'drawTwo';

                } else if ((skipPlayer && (valueMatches || suitMatches)) || (skipPlayer && crazyEightSuitMatches && !cardResolved.current)) {
                    // Logic for card with the value of four
                    console.log(`${selectedCard.code} clears the skip player card logic.`);

                    return 'skipPlayer';
                } else {
                    console.error({
                        message: 'Something went wrong when checking card',
                        usersTurn: usersTurn,
                        card: card,
                        selectedCard: selectedCard,
                        topCardInPile: topCardInPile,
                        cardResolved: cardResolved,
                        suitSelected: suitSelected,
                        cardOnTop: cardOnTop,
                    });

                    return 'pluck';
                };
            },
            playACard: (fromComputer, card) => {
                // Putting cards down in the pile.
                let selectedCard = card;

                if (fromComputer) {
                    // The functionality for computer
                    setCardState(prevState => ({
                        ...prevState,
                        topCardInPile: selectedCard,
                        cardPileHistory: [...prevState.cardPileHistory, selectedCard],
                        computersCardsInHand: prevState.computersCardsInHand.filter(card => card.code !== selectedCard.code),
                    }));

                    cardOnTop.current = selectedCard;

                } else if (!fromComputer) {
                    // The functionality for user
                    setCardState(prevState => ({
                        ...prevState,
                        topCardInPile: selectedCard,
                        userCardsInHand: prevState.userCardsInHand.filter(card => card.code !== selectedCard.code),
                        cardPileHistory: [...prevState.cardPileHistory, selectedCard],
                    }));

                    cardOnTop.current = selectedCard;

                } else {

                };
            },
            handleCrazyEight: (fromComputer, event, reason) => {

                console.log({
                    alert: 'handleCrazyEight function running...',
                    event: event,
                    reason: reason,
                    fromComputer: fromComputer,
                });

                if (reason === "backdropClick" || reason === "escapeKeyDown") {
                    return;
                };

                if (fromComputer) {
                    console.log('Computer for handleCrazyEight logic running.');
                    // Crazy eight logic for computer
                    usersTurn.current = true;
                    suitSelected.current = event;
                    cardResolved.current = false;

                    setTimeout(() => {
                        setCrazyEight(false);
                    }, 2000);

                } else if (!fromComputer) {
                    console.log('User for handleCrazyEight logic running.');

                    // Uppercase the suit in the event
                    const suitUpperCased = event.target.alt.toUpperCase();

                    usersTurn.current = false;
                    suitSelected.current = suitUpperCased;
                    cardResolved.current = false;
                    setCrazyEight(false);

                    // Complete this statement below, you gotta pass arguments
                    gameFunctions.computerResponse(null, suitUpperCased);
                };

            },
            drawCards: async (fromComputer, drawTwo) => {
                // Ensure fromComputer is a boolean and drawTwo is a boolean as well
                if (typeof fromComputer !== 'boolean' || typeof drawTwo !== 'boolean') {
                    console.error(`Invalid parameter types. "fromComputer": ${fromComputer}, "drawTwo": ${drawTwo}. Both must be booleans.`);
                    return; // Stop further execution or handle the error as needed
                };

                // Drawing one of multiple cards logic
                const pluck = drawTwo ? false : 'pluck';

                if (fromComputer) {
                    // Logic for computer's turn

                    if (pluck === 'pluck') {
                        // Computer plucks a card from the deck
                        await drawACard('computersCardsInHand');
                    } else {
                        // Computer makes users draw two cards
                        console.log('(drawCardsFunction, Computer is making the user draw two cards)');
                        // Computer makes user draw two cards
                        await drawTwoCards('userCardsInHand');
                    };

                } else if (!fromComputer) {

                    if (pluck === 'pluck') {
                        // User plucks a card from the deck
                        console.log('User plucked a card from the deck');
                        await drawACard('userCardsInHand');

                        //Triggers computer response;
                        usersTurn.current = false;

                        // Trigger's computer's response to user plucking from the deck
                        gameFunctions.computerResponse(cardState.topCardInPile);
                    } else {
                        // User makes computer draw two cards
                        console.log('(drawCardsFunction, user is making the computer draw two cards)');
                        await drawTwoCards('computersCardsInHand');
                    };

                } else {
                    console.error('Something went wrong drawing cards function');
                };
            },
        },
    };

    return (
        <GamePagePres

            // Card hands & pile states
            cardState={cardState}

            playerActions={{
                handleUserTurn: gameFunctions.handleUserTurn,
                playerDrawsACard: gameFunctions.gameLogic.drawCards,
                handleCrazyEight: gameFunctions.gameLogic.handleCrazyEight,
            }}

            crazyEight={crazyEight}
        />
    )

}
