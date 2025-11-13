import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 3, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold">
            Marketfy
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Welcome to your shopping destination
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {activeTab === 0 ? <LoginForm /> : <RegisterForm />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
