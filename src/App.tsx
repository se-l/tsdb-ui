import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { setConstantValue } from 'typescript';
import { AppContext } from './AppContext';
import { Box, Container, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { theme } from './styles/theme';
import { AppContextDiscoverValues } from './components/discover/AppContext';
import LandingDiscover from './components/discover/LandingDiscover';
import { LOCALHOST } from './Constants';

function App() {
  const [apiUrl, setApiUrl] = useState(LOCALHOST)
  const [layoutDrawerOpen, setLayoutDrawerOpen] = useState(true)

  const appContextRootValues = {
    apiUrl: apiUrl,
    layoutDrawerOpen: layoutDrawerOpen,
    setLayoutDrawerOpen: setLayoutDrawerOpen,
  }

  const appContextDiscoverValues = AppContextDiscoverValues();
  
  // useEffect(() => {Promise.resolve()})  get API URL
  return (
    <AppContext.Provider
      value={{
        ...appContextRootValues,
        ...appContextDiscoverValues,
      }}
    >
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Box component="main">
            <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
              <Routes>
                <Route path="/" element={<LandingDiscover />} />
              </Routes>
            </Container>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
