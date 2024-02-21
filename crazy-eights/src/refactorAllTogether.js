computerResponse: async (suit, value, card) => {
    console.log({
        message: 'Last card from pile being shown in computerResponse function',
        suit,
        value,
        card,
    });

    const currentTurn = whosTurn.user ? 'user' : 'computer';

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

        if (!whosTurn[currentTurn]) {
            console.log(`Function A is running during ${currentTurn}'s turn`);

            // Set the flag to true before calling Function B
            setPlayersTurn(prevState => ({
                ...prevState,
                [currentTurn]: true,
            }));

            const randomlySelectedCard = cardState.computersCardsInHand
                .filter(card => card.suit === suit || card.value === value)
            [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === suit || card.value === value).length)];

            // This is where data will go from Function A to Function B
            console.log("Data from Function A:", dataToPass);

            // Simulate a call to Function B with additional parameter
            computerResponse.putCradInPile({ fromComputer: true, randomlySelectedCard });

            // Reset the flag after the call to Function B
            setPlayersTurn(prevState => ({
                ...prevState,
                [currentTurn]: false,
            }));

            console.log(`Function A completed during ${currentTurn}'s turn`);
        } else {
            console.log(`Function A is already in progress during ${currentTurn}'s turn, skipping recursive call`);
        }

        // const randomlySelectedCard = cardState.computersCardsInHand
        //     .filter(card => card.suit === suit || card.value === value)
        // [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === suit || card.value === value).length)];

        // if (randomlySelectedCard === undefined) {
        //     // Handle the case when there are no matching cards
        //     console.log('There were no matching cards in hand');
        //     gameFunctions.playerDrawsACard();

        //     return;
        // }

        // console.log({
        //     randomlySelectedCard,
        //     computersCardsInHand: cardState.computersCardsInHand,
        //     suitMessage: `Computer has to put down a ${suit} card or pluck from the deck`,
        //     message: 'Not a special card condition ran'
        // });

        // // setTimeout(() => {
        // setCardState(prevState => ({
        //     ...prevState,
        //     topCardInPile: randomlySelectedCard,
        //     computersCardsInHand: prevState.computersCardsInHand.filter((card) => card !== randomlySelectedCard),
        // }));
        // gameFunctions.putCardInPile(randomlySelectedCard);
        // // }, 1000);

    } else {
        return
    }

},

    putCardInPile: (fromComputer, card) => {
        console.log('Put card in pile function ran');

        const currentTurn = whosTurn.user ? 'user' : 'computer';
        console.log(`Function B is running during ${currentTurn}'s turn`);

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
            if (fromFunctionA) {
                console.log(`Function B received call from Function A during ${currentTurn}'s turn with data:`, dataToPass);
                // This is where data will go from Function B to Function A
                // Modify or conditionally handle the data here before calling Function A again
                setCardState(prevState => ({
                    ...prevState,
                    topCardInPile: randomlySelectedCard,
                    computersCardsInHand: prevState.computersCardsInHand.filter((card) => card !== randomlySelectedCard),
                }));
                // gameFunctions.computerResponse(suit, value, selectedCard);
            } else {
                // This is where data will go from Function B to Function A
                // Modify or conditionally handle the data here before calling Function A again
                console.log("Put card in pile function received a regular call by user");
                setCardState((prevState) => {
                    // Find the card in the user's hand *state* and remove it
                    const updatedUserCardsInHand = prevState.userCardsInHand.filter((card) => card.code !== selectedCard.code);

                    return {
                        ...prevState,
                        topCardInPile: selectedCard,
                        userCardsInHand: updatedUserCardsInHand,
                    };
                });
                gameFunctions.computerResponse(suit, value, selectedCard);
            }
            // if (whosTurn.user) {

            //     setCardState((prevState) => {
            //         // Find the card in the user's hand *state* and remove it
            //         const updatedUserCardsInHand = prevState.userCardsInHand.filter((card) => card.code !== selectedCard.code);

            //         return {
            //             ...prevState,
            //             topCardInPile: selectedCard,
            //             userCardsInHand: updatedUserCardsInHand,
            //         };
            //     });

            //     // Calls the user comp function so the computer can respond to the action.
            //     gameFunctions.computerResponse(suit, value, selectedCard);
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
            })
            return
        }
        console.log("Put card in data completed during", currentTurn);
    },

        onClick = {() => playerActions.putCardInPile(fromComputer: false, card)}