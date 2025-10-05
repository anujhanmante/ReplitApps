import React, { useState, useEffect } from "react";
import { Apple, Plus, Target } from "lucide-react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";

const FoodLog = ({ onTotalsChange, goals, onGoalsChange }) => {
  const { user } = useAuth();
  const [foodLog, setFoodLog] = useState([]);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showGoals, setShowGoals] = useState(false);

  // Form states
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  // Goals form state
  const [goalCalories, setGoalCalories] = useState(goals.calories);
  const [goalProtein, setGoalProtein] = useState(goals.protein);
  const [goalCarbs, setGoalCarbs] = useState(goals.carbs);
  const [goalFat, setGoalFat] = useState(goals.fat);

  // Listen to food log changes from Firebase
  useEffect(() => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const foodQuery = query(
      collection(db, "users", user.uid, "foodLogs"),
      where("date", "==", today),
    );

    const unsubscribe = onSnapshot(foodQuery, (snapshot) => {
      const foods = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoodLog(foods);

      // Calculate totals
      const totals = foods.reduce(
        (acc, food) => ({
          calories: acc.calories + food.calories,
          protein: acc.protein + food.protein,
          carbs: acc.carbs + food.carbs,
          fat: acc.fat + food.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );

      onTotalsChange(totals);
    });

    return () => unsubscribe();
  }, [user, onTotalsChange]);

  const handleAddFood = async (e) => {
    e.preventDefault();

    try {
      const today = new Date().toISOString().split("T")[0];
      await addDoc(collection(db, "users", user.uid, "foodLogs"), {
        name: foodName,
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        date: today,
        timestamp: new Date().toISOString(),
      });

      // Reset form
      setFoodName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      setShowAddFood(false);
    } catch (error) {
      console.error("Error adding food:", error);
      alert("Failed to add food. Please try again.");
    }
  };

  const handleDeleteFood = async (foodId) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "foodLogs", foodId));
    } catch (error) {
      console.error("Error deleting food:", error);
      alert("Failed to delete food. Please try again.");
    }
  };

  const handleUpdateGoals = async (e) => {
    e.preventDefault();
    const newGoals = {
      calories: Number(goalCalories),
      protein: Number(goalProtein),
      carbs: Number(goalCarbs),
      fat: Number(goalFat),
    };

    try {
      await setDoc(doc(db, "users", user.uid, "settings", "goals"), newGoals);
      onGoalsChange(newGoals);
      setShowGoals(false);
    } catch (error) {
      console.error("Error updating goals:", error);
      alert("Failed to update goals. Please try again.");
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowAddFood(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Add Food</span>
        </button>
        <button
          onClick={() => {
            setGoalCalories(goals.calories);
            setGoalProtein(goals.protein);
            setGoalCarbs(goals.carbs);
            setGoalFat(goals.fat);
            setShowGoals(true);
          }}
          className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          <Target className="w-5 h-5" />
          <span>Set Goals</span>
        </button>
      </div>

      {/* Food Log */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Today's Food Log
        </h2>

        {foodLog.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Apple className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No foods logged yet. Start by adding your first meal!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {foodLog.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{food.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {food.calories}kcal • P: {food.protein}g • C: {food.carbs}g
                    • F: {food.fat}g
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteFood(food.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Food</h2>

            <form onSubmit={handleAddFood} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Add Food
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFood(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Goals Modal */}
      {showGoals && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Set Daily Goals
            </h2>

            <form onSubmit={handleUpdateGoals} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calories Goal
                </label>
                <input
                  type="number"
                  value={goalCalories}
                  onChange={(e) => setGoalCalories(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protein Goal (g)
                </label>
                <input
                  type="number"
                  value={goalProtein}
                  onChange={(e) => setGoalProtein(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbs Goal (g)
                </label>
                <input
                  type="number"
                  value={goalCarbs}
                  onChange={(e) => setGoalCarbs(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fat Goal (g)
                </label>
                <input
                  type="number"
                  value={goalFat}
                  onChange={(e) => setGoalFat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Save Goals
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoals(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodLog;
