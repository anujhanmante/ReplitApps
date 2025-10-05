import React from "react";
import { Flame, TrendingUp, Apple, Target } from "lucide-react";

const ProgressBar = ({ current, goal, color }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const MacroCard = ({
  icon: Icon,
  label,
  current,
  goal,
  unit,
  color,
  bgColor,
}) => {
  const percentage = Math.round((current / goal) * 100);

  return (
    <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className={`text-sm font-semibold ${color}`}>{percentage}%</span>
      </div>

      <h3 className="text-gray-600 text-sm font-medium mb-1">{label}</h3>
      <p className="text-2xl font-bold text-gray-800 mb-3">
        {current}
        <span className="text-sm text-gray-500">
          /{goal}
          {unit}
        </span>
      </p>

      <ProgressBar current={current} goal={goal} color={color} />
    </div>
  );
};

const MacroCards = ({ totals, goals }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MacroCard
        icon={Flame}
        label="Calories"
        current={Math.round(totals.calories)}
        goal={goals.calories}
        unit="kcal"
        color="text-orange-600"
        bgColor="bg-orange-100"
      />
      <MacroCard
        icon={TrendingUp}
        label="Protein"
        current={Math.round(totals.protein)}
        goal={goals.protein}
        unit="g"
        color="text-blue-600"
        bgColor="bg-blue-100"
      />
      <MacroCard
        icon={Apple}
        label="Carbs"
        current={Math.round(totals.carbs)}
        goal={goals.carbs}
        unit="g"
        color="text-green-600"
        bgColor="bg-green-100"
      />
      <MacroCard
        icon={Target}
        label="Fat"
        current={Math.round(totals.fat)}
        goal={goals.fat}
        unit="g"
        color="text-purple-600"
        bgColor="bg-purple-100"
      />
    </div>
  );
};

export default MacroCards;
