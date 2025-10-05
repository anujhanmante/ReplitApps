import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

const AppContent = () => {
  const { user } = useAuth();

  return user ? <Dashboard /> : <Auth />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
