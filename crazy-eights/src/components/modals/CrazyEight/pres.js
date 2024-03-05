import { Box, Container, Modal } from "@mui/material";
import { SuitItem } from "./styles/components/crazyEightModalStyledComponents";
import { styles } from "./styles/jss/crazyEightStyles";


export const CrazyEightPres = ({
    open,
    onClose,
}) => {
    return (
        <Modal
            disableAutoFocus={true}
            disableEscapeKeyDown={true}
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
                    ...styles.modalContainer
                }}
            >
                <Container
                    sx={{
                        ...styles.imageContainer
                    }}
                >
                    <Container
                        disableGutters={true}
                        sx={{
                            ...styles.imageContainer.heartAndSpadesContainer
                        }}
                    >
                        <SuitItem
                            component='img'
                            src='/heart-symbol.png'
                            alt='Hearts'
                            onClick={(e) => onClose(false, e)}
                        />
                        <SuitItem
                            component='img'
                            src='/spade-symbol.png'
                            alt='Spades'
                            onClick={(e) => onClose(false, e)}
                        />
                    </Container>
                    <Container
                        disableGutters={true}
                        sx={{
                            ...styles.imageContainer.clubsAndDiamondsContainer
                        }}
                    >
                        <SuitItem
                            component='img'
                            src='/club-symbol.png'
                            alt='Clubs'
                            onClick={(e) => onClose(false, e)}
                        />
                        <SuitItem
                            component='img'
                            src='/diamond-symbol.png'
                            alt='Diamonds'
                            onClick={(e) => onClose(false, e)}
                        />
                    </Container>
                </Container>
            </Box>
        </Modal>
    );
};
