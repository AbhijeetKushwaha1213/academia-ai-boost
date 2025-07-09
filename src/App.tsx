
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainApp } from './components/MainApp';
import { AuthProvider } from './components/auth/AuthProvider';
import { Toaster } from './components/ui/toaster';
import Landing from './pages/Landing';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/*" element={<MainApp />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
