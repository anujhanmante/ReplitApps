import React, { useState } from "react";
import { Apple } from "lucide-react";
import { useAuth } from "../AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(email, password, name);
    }

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen ${isLogin ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-purple-500 to-pink-600"} flex items-center justify-center p-4`}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className={`inline-block p-3 ${isLogin ? "bg-blue-100" : "bg-purple-100"} rounded-full mb-4`}
          >
            <Apple
              className={`w-8 h-8 ${isLogin ? "text-blue-600" : "text-purple-600"}`}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isLogin ? "Macro Tracker" : "Create Account"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin
              ? "Track your nutrition goals"
              : "Start tracking your macros today"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${isLogin ? "focus:ring-blue-500" : "focus:ring-purple-500"} focus:border-transparent`}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${isLogin ? "focus:ring-blue-500" : "focus:ring-purple-500"} focus:border-transparent`}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${isLogin ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"} text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className={`${isLogin ? "text-blue-600" : "text-purple-600"} font-semibold hover:underline`}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
