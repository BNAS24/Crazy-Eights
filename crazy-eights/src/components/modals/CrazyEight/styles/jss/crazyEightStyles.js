export const styles = {
    modalContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
        minWidth: '300px',
        height: '50vh',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        border: 'solid 2px var(--theme-orange)',
        overflowY: 'hidden',
    },
    imageContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        height: '100%',
        width: '100%',
        heartAndSpadesContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%'
        },
        clubsAndDiamondsContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%'
        },
    },
};