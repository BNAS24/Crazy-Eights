// console.log('Selecting a random card');

// const randomlySelectedCard = cardState.computersCardsInHand
//     .filter(card => card.suit === suit || card.value === value || card.value === '8')
// [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === suit || card.value === value).length)];

// if (randomlySelectedCard) {
//     console.log('Randomly selected card:', randomlySelectedCard)
//     setCardState(prevState => ({
//         ...prevState,
//         topCardInPile: randomlySelectedCard,
//         computersCardsInHand: prevState.computersCardsInHand.filter((card) => card.code !== randomlySelectedCard.code),
//     }));

//     gameFunctions.putCardInPile(true, randomlySelectedCard);
// } else {
//     console.log('Computer has to draw a card because it couldnt find a matching suit or number')
//     gameFunctions.playerDrawsACard(true);
// }

// gameFunctions line: 253
// else {

//     setTimeout(() => {
//         console.log('Selecting a random card');

//         const randomlySelectedCard = cardState.computersCardsInHand
//             .filter(card => card.suit === suit || card.value === value || card.value === '8')
//         [Math.floor(Math.random() * cardState.computersCardsInHand.filter(card => card.suit === suit || card.value === value).length)];

//         if (randomlySelectedCard) {
//             console.log('Randomly selected card:', randomlySelectedCard)
//             setCardState(prevState => ({
//                 ...prevState,
//                 topCardInPile: randomlySelectedCard,
//                 computersCardsInHand: prevState.computersCardsInHand.filter((card) => card.code !== randomlySelectedCard.code),
//             }));

//             gameFunctions.putCardInPile(true, randomlySelectedCard);
//         } else {
//             console.log('Computer has to draw a card because it couldnt find a matching suit or number')
//             gameFunctions.playerDrawsACard(true);
//         }
//     }, 2000);
// }

// console.log('hmmmmmmmm');