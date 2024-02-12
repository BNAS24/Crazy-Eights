import { Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { GameContainer } from './pages/gamepage/gameContainer';
import { HomePageContainer } from './pages/homepage/homePageContainer';
import { darkModeTheme, lightModeTheme } from './styles/themes/muiTheme';

export const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkModeTheme : lightModeTheme}>
      <Button
        variant='contained'
        disableElevation
        onClick={toggleDarkMode}
        sx={{
          position: 'absolute',
          top: '00px',
          color: 'var(--theme-white)',
          backgroundColor: 'var(--theme-black)',
          zIndex: 1000,
          '&:hover':{
            backgroundColor: 'grey',
          }
        }}
      >
        theme mode
      </Button>
      <Routes>
        <Route path='/' element={<HomePageContainer />} />
        <Route path='/game' element={<GameContainer />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;