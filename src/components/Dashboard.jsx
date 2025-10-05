import React, { useState, useEffect } from "react";
import { Apple, LogOut } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import MacroCards from "./MacroCards";
import FoodLog from "./FoodLog";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  });
  const [loading, setLoading] = useState(true);

  // Load user goals from Firebase
  useEffect(() => {
    const loadGoals = async () => {
      if (!user) return;

      try {
        const goalsDoc = await getDoc(
          doc(db, "users", user.uid, "settings", "goals"),
        );
        if (goalsDoc.exists()) {
          setGoals(goalsDoc.data());
        }
      } catch (error) {
        console.error("Error loading goals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Apple className="w-12 h-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Apple className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Macro Tracker</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-800">
                {user?.name || user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Macro Cards */}
        <div className="mb-8">
          <MacroCards totals={totals} goals={goals} />
        </div>

        {/* Food Log */}
        <FoodLog
          onTotalsChange={setTotals}
          goals={goals}
          onGoalsChange={setGoals}
        />
      </main>
    </div>
  );
};

export default Dashboard;
