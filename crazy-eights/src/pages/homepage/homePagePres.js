import { Avatar, Button, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import { Link } from 'react-router-dom';
import { homePageStyles } from './styles/jssStyles';

export const HomePagePres = () => {

    const theme = useTheme();

    return (
        <Container
            disableGutters={true}
            maxWidth='xl'
            style={homePageStyles.topContainer}
            sx={{
                backgroundColor: theme.palette.primary.main,
            }}
        >
            <Typography
                variant='h1'
                align='center'
            >
                Crazy 8's
            </Typography>
            <Avatar
                variant='square'
                alt='cards'
                src='/cards.jpg'
                style={homePageStyles.heroImage}
            />
            <Button
                variant='outlined'
                size='large'
                component={Link}
                to='/game'
                sx={{
                    color: theme.palette.primary.text.primary,
                    borderColor: theme.palette.primary.text.primary,
                    '&:hover': {
                        borderColor: theme.palette.primary.text.primary,
                        backgroundColor: 'transparent',
                    },
                }}
            >
                PLAY
            </Button>
        </Container>
    );
};
