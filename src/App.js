import './App.css';
import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import SplashScreen from './pages/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return loading ? <SplashScreen /> : <Dashboard />;
}

export default App;
