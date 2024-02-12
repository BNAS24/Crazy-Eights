export const gamePageStyles = {
    topContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        height: '100%',
        minHeight: '100vh',
    },
    opponentCardStackContainer: {
        display: 'flex',
        justifyContent: 'center',
        cards: {
            height: 'auto',
            width: '80px',
            marginLeft: '-30px',
        }
    },
    deckOfCardConainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        border: 'dashed 1px blue',
        height: '100%',
        overflow: 'hidden',
        firstCard: {
            height: 'auto',
            width: '80px',
        },
        deck: {
            marginLeft: '-81px',
            height: 'auto',
            width: '80px',
        },
        cardPool: {
            position: 'absolute',
            height: 'auto',
            width: '80px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }
    },
    userCardStackContainer: {
        display: 'flex',
        justifyContent: 'center',
        cards: {
            height: 'auto',
            width: '80px',
            marginLeft: '-30px',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    },
};