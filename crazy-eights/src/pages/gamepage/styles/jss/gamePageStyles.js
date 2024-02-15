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
        flexWrap: 'wrap',
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
        height: '100%',
        overflow: 'hidden',
        paddingTop: '24px',
        paddingBottom: '24px',
        firstCard: {
            height: 'auto',
            width: '80px',
            boxShadow: '-8px 0px 8px #100c08',
        },
        deck: {
            marginLeft: '-81px',
            height: 'auto',
            width: '80px',
            '&:hover': {
                cursor: 'pointer',
            },
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
        flexWrap: 'wrap',
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