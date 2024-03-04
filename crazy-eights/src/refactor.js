// const drawTwoCards = async (stateName) => {

//     try {

//         const response = await fetch(`https://deckofcardsapi.com/api/deck/${isDeck.deck_id}/draw/?count=2`);

//         if (!response.ok) {
//             console.error('Failed to draw cards from deck');
//         }

//         const cards = await response.json();

//         setCardState(prevState => ({
//             ...prevState,
//             remainingCardsInDeck: cards.remaining,
//             [stateName]: [...prevState[stateName], ...cards.cards],
//         }));

//     } catch (error) {
//         console.log(error);
//     }
// };

// const drawACard = async (stateName) => {

//     try {

//         const response = await fetch(`https://deckofcardsapi.com/api/deck/${isDeck.deck_id}/draw/?count=1`);

//         if (!response.ok) {
//             console.error('Failed to draw card from deck');
//         };

//         const card = await response.json();

//         console.log('drawn card', card.cards[0]);

//         setCardState(prevState => ({
//             ...prevState,
//             remainingCardsInDeck: card.remaining,
//             [stateName]: [...prevState[stateName], ...card.cards[0]],
//         }));

//     } catch (error) {
//         console.log(error);
//     }

// };

// const [isDeck, setDeck] = useState({});

// const [cardState, setCardState] = useState({
//     topCardInPile: {},
//     userCardsInHand: [],
//     computersCardsInHand: [],
//     cardPileHistory: [],
//     deck_id: '',
//     remainingCardsInDeck: null,
// });

// const [crazyEight, setCrazyEight] = useState(false);

// /* Variable that will check if the user has to obey the rules
// of the current top card in the pile or continue to play as normal*/
// let usersTurn = true;
// let suitSelected = null;
// let cardResolved = true;

// const gameFunctions = {
//     handleUserTurn: (card, pluck) => {
//         console.log('User made a decision during their turn');

//         const plucked = pluck;

//         // Plucking a card instead of selecting a card
//         if (plucked) {
//             gameFunctions.gameLogic.drawCards(false, false);
//             gameFunctions.computerResponse(cardState.topCardInPile);
//         };

//         // Selecting  a card logic
//         if (usersTurn && !plucked) {
//             const selectedCard = card;

//             // Captures the value of the function and stores it in a variable
//             const cardAndSate = gameFunctions.gameLogic.checkCards(selectedCard);

//             console.log(cardAndSate);

//             // Uses the value from cardAndState to make a decision.
//             if (cardAndSate === 'normal') {
//                 // Calls the function that puts down card in pile.
//                 gameFunctions.gameLogic.playACard(false, selectedCard);

//                 // Resets card state
//                 suitSelected = null;
//                 cardResolved = true;

//                 // Sets the state to the computers turn
//                 usersTurn = false;

//                 //Calls the function for the user to respond to the users play decision.
//                 gameFunctions.computerResponse(cardState.topCardInPile); // I might want to use the actual selected card variable to make sure the state is updated fast enough

//             } else if (cardAndSate === 'crazyEight') {
//                 // Calls the function that puts down card in pile.
//                 gameFunctions.gameLogic.playACard(false, selectedCard);

//                 //Open crazyEight modal
//                 setCrazyEight(true);

//             } else if (cardAndSate === 'drawTwo') {

//                 gameFunctions.gameLogic.drawCards(false, true);

//             } else if (cardAndSate === 'skip') {

//                 console.log('User skipped computers turn');

//             } else if (cardAndSate === 'pluck') {

//                 console.log('Card doesnt match user either needs a card that matches or pluck from the deck');
//                 // gameFunctions.gameLogic.drawCards(false, false);

//             } else {
//                 console.log({
//                     message: 'return?',
//                     card: card,
//                     cardAndSate: cardAndSate,
//                 });
//             }
//         } else {
//             console.error('Action forbidden, computers turn');
//             return;
//         };
//     },
//     computerResponse: (card, paramSuitSelected) => {
//         console.log('Computer made a decision during their turn');

//         const cardInPile = card;
//         const suit = cardInPile.suit;
//         const value = cardInPile.value;

//         let randomlySelectedCard;
//         let cardMatchedWithSuit;

//         if (!usersTurn) {
//             // Logic to select a card a card
//             if (card) {
//                 randomlySelectedCard = cardState.computersCardsInHand
//                     .filter(card => card.suit === suit || card.value === value || card.value === '8')
//                 [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === suit ||
//                     card.value === value).length)];
//             } else {
//                 cardMatchedWithSuit = cardState.computersCardsInHand
//                     .filter(card => card.suit === paramSuitSelected)
//                 [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === paramSuitSelected).length)];
//             };

//             // Card checked that user put down in the pile.
//             if (randomlySelectedCard) {

//                 const cardAndState = gameFunctions.gameLogic.checkCards(randomlySelectedCard);

//                 if (cardAndState === 'normal') {
//                     // Calls the function that puts down card in pile.
//                     gameFunctions.gameLogic.playACard(true, randomlySelectedCard);

//                     // Resets card state
//                     suitSelected = null;
//                     cardResolved = true;

//                     // Sets the state back to users turn
//                     usersTurn = true;

//                 } else if (cardAndState === 'crazyEight') {
//                     // Calls the function that puts down card in pile.
//                     gameFunctions.gameLogic.playACard(true, randomlySelectedCard);

//                     //Open crazyEight modal
//                     setCrazyEight(true);

//                     const crazyEightSelections = ['SPADES', 'HEARTS', 'CLUBS', 'DIAMONDS'];

//                     const selectedSuit = crazyEightSelections[Math.floor(Math.random() * crazyEightSelections.length)];

//                     const reason = 'backdropClick';

//                     setTimeout(() => {
//                         gameFunctions.gameLogic.handleCrazyEight(true, selectedSuit, reason);
//                     }, 2000);

//                 } else if (cardAndState === 'drawTwo') {

//                     gameFunctions.gameLogic.drawCards(true, true);

//                 } else if (cardAndState === 'skip') {

//                     console.log('User skipped computers turn');

//                 } else if (cardAndState === 'pluck') {

//                     console.log('Computer needs to pluck from the deck');
//                     // gameFunctions.gameLogic.drawCards(false, false);

//                 } else {
//                     console.log({
//                         message: 'return?',
//                         card: card,
//                         cardAndSate: cardAndState,
//                     });
//                 }

//             } else if (cardMatchedWithSuit) {
//                 // Send the card that matches the crazy suit to get checked by the middleware function
//                 const cardAndState = gameFunctions.gameLogic.checkCards(cardMatchedWithSuit);

//                 if (cardAndState === 'normal') {
//                     // Play the card
//                     gameFunctions.gameLogic.playACard(true, cardMatchedWithSuit);

//                     // Sets the suit selected state back to normal
//                     suitSelected = null;
//                     cardResolved = true;

//                 } else if (cardAndState === 'crazyEight') {
//                     // Play the card
//                     gameFunctions.gameLogic.playACard(true, cardMatchedWithSuit);

//                     // Sets the suit selected state back to normal
//                     suitSelected = null;
//                     cardResolved = true;
//                 } else if (cardAndState === 'drawTwo') {
//                     // Computer makes the user draw two cards
//                     gameFunctions.gameLogic.drawCards(true, true);

//                     // Sets the suit selected state back to normal
//                     suitSelected = null;
//                     cardResolved = true;
//                 } else if (cardAndState === 'skip') {

//                     console.log('User skipped computers turn');

//                 } else if (cardAndState === 'pluck') {

//                     console.log('Computer needs to pluck from the deck');

//                     gameFunctions.gameLogic.drawCards(true, false);

//                 };
//             } else {
//                 // Logic for when the computer cant find a matching card inside the deck.
//             };
//             // Logic to 
//         } else {
//             console.error('Action forbidden, users turn');
//             return;
//         };
//     },
//     gameLogic: {
//         checkCards: (card) => {
//             /* This will basically check the state of the card 
//             being played and the state of the game. Will be the 
//             middle function between a players decision and the action 
//             being done.*/
//             console.log('Checking cards...');

//             const selectedCard = card;
//             const topCardInPile = cardState.topCardInPile;
//             const suitMatches = selectedCard.suit === topCardInPile.suit;
//             const crazyEightSuitMatches = suitSelected === selectedCard.suit;
//             const valueMatches = selectedCard.value === topCardInPile.value;
//             const crazyEight = selectedCard.value === '8';
//             const skipPlayer = selectedCard.value === '4';
//             const drawTwo = selectedCard.value === '2';
//             const aSpecialCard = ['2', '4', '8'].includes(selectedCard.value);

//             if ((!aSpecialCard && (suitMatches || valueMatches) && cardResolved) ||
//                 (!aSpecialCard && crazyEightSuitMatches && !cardResolved)) {
//                 // Logic for normal card
//                 console.log(`${selectedCard} clears the normal card logic.`);

//                 return 'normal';

//             } else if (crazyEight) {
//                 // Logic for crazy 8 card
//                 console.log(`${selectedCard} clears the crazy eight card logic.`);

//                 return 'crazyEight';

//             } else if ((drawTwo && suitMatches) || (drawTwo && crazyEightSuitMatches && !cardResolved)) {

//                 // Logic for card with the value of two
//                 console.log(`${selectedCard} clears the draw two card logic.`);

//                 // Return statement
//                 return 'drawTwo';

//             } else if ((skipPlayer && suitMatches) || (skipPlayer && crazyEightSuitMatches && !cardResolved)) {
//                 // Logic for card with the value of four
//                 console.log(`${selectedCard} clears the skip player card logic.`);

//                 return 'skipPlayer';
//             } else {
//                 console.error('Something went wrong when checking card');

//                 return 'pluck';
//             };
//         },
//         playACard: (fromComputer, card) => {
//             // Putting cards down in the pile.
//             let selectedCard = card;

//             if (fromComputer) {
//                 // The functionality for computer
//                 setCardState(prevState => ({
//                     ...prevState,
//                     topCardInPile: selectedCard,
//                     cardPileHistory: [...prevState.cardPileHistory, selectedCard],
//                     computersCardsInHand: prevState.computersCardsInHand.filter(card => card.code !== selectedCard.code),
//                 }));
//             } else if (!fromComputer) {
//                 // The functionality for user
//                 setCardState(prevState => ({
//                     ...prevState,
//                     topCardInPile: selectedCard,
//                     userCardsInHand: prevState.userCardsInHand.filter(card => card.code !== selectedCard.code),
//                     cardPileHistory: [...prevState.cardPileHistory, selectedCard],
//                 }));
//             } else {

//             };
//         },
//         handleCrazyEight: (fromComputer, event, reason) => {

//             console.log({
//                 alert: 'handleCrazyEight function running...',
//                 event: event,
//                 reason: reason,
//             });

//             if (reason === "backdropClick" || reason === "escapeKeyDown") {
//                 return;
//             };

//             if (fromComputer) {
//                 // Crazy eight logic for computer
//                 usersTurn = false;
//                 suitSelected = event;
//                 cardResolved = false;

//                 setTimeout(() => {
//                     setCrazyEight(false);
//                 }, 2000);

//             } else {
//                 // Crazy eight logic for user

//                 // Uppercase the suit in the event
//                 const suitUpperCased = event.target.alt.toUpperCase();

//                 suitSelected = suitUpperCased;
//                 cardResolved = false;
//                 setCrazyEight(false);

//                 // Complete this statement below, you gotta pass arguments
//                 gameFunctions.computerResponse(null, suitUpperCased);
//             };

//         },
//         drawCards: async (fromComputer, drawTwo) => {
//             // Ensure fromComputer is a boolean and drawTwo is a boolean as well
//             if (typeof fromComputer !== 'boolean' || typeof drawTwo !== 'boolean') {
//                 console.error(`Invalid parameter types. "fromComputer": ${fromComputer}, "drawTwo": ${drawTwo}. Both must be booleans.`);
//                 return; // Stop further execution or handle the error as needed
//             };

//             // Drawing one of multiple cards logic
//             const pluck = drawTwo ? false : 'pluck';

//             if (fromComputer) {
//                 // Logic for computer's turn

//                 if (pluck === 'pluck') {
//                     // Computer plucks a card from the deck
//                     await drawACard('computersCardsInHand');
//                 } else {
//                     // Computer makes user draw two cards
//                     await drawTwoCards('computersCardsInHand');
//                 };

//             } else if (!fromComputer) {
//                 if (pluck === 'pluck') {
//                     // User plucks a card from the deck
//                     await drawACard('userCardsInHand');

//                     //Triggers computer response;
//                     // usersTurn = false;
//                     gameFunctions.computerResponse(cardState.topCardInPile);
//                 } else {
//                     // User makes computer draw two cards
//                     await drawTwoCards('userCardsInHand');
//                 };

//             } else {
//                 console.error('Something went wrong drawing cards function');
//             };
//         },
//     },
// };