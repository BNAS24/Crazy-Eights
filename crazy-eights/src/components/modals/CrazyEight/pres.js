import { Box, Container, Modal } from "@mui/material";
import { styled } from '@mui/system';

const SuitItem = styled(Box)(({ theme }) =>
    theme.unstable_sx({
        display: 'flex',
        height: '100px',
        widht: '100px',
        '&:hover': {
            cursor: 'pointer',
        },
    })
)

export const CrazyEightPres = ({
    open,
    onClose,
}) => {
    return (
        <Modal
            disableAutoFocus={true}
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
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
                }}
            >
                <Container
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Container
                        disableGutters={true}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            width: '100%'
                        }}
                    >
                        <SuitItem
                            component='img'
                            src='/heart-symbol.png'
                            alt='hearts symbol'
                            onClick={onClose}
                        />
                        <SuitItem
                            component='img'
                            src='/spade-symbol.png'
                            alt='spades symbol'
                            onClick={onClose}
                        />
                    </Container>
                    <Container
                        disableGutters={true}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            width: '100%'
                        }}
                    >
                        <SuitItem
                            component='img'
                            src='/club-symbol.png'
                            alt='clubs symbol'
                            onClick={onClose}
                        />
                        <SuitItem
                            component='img'
                            src='/diamond-symbol.png'
                            alt='diamonds symbol'
                            onClick={onClose}
                        />
                    </Container>
                </Container>
            </Box>
        </Modal>
    )
}
