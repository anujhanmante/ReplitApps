import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

const TestFirebase = () => {
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");

  // Test 1: Firebase Connection
  const testConnection = () => {
    if (auth && db) {
      setStatus("✅ Firebase initialized successfully!");
    } else {
      setStatus("❌ Firebase initialization failed");
    }
  };

  // Test 2: Create Test User
  const testCreateUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setStatus(
        `✅ User created successfully! UID: ${userCredential.user.uid}`,
      );
    } catch (error) {
      setStatus(`❌ Error creating user: ${error.message}`);
    }
  };

  // Test 3: Login Test User
  const testLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      setStatus(`✅ Login successful! User: ${userCredential.user.email}`);
    } catch (error) {
      setStatus(`❌ Login error: ${error.message}`);
    }
  };

  // Test 4: Write to Firestore
  const testFirestore = async () => {
    try {
      const docRef = await addDoc(collection(db, "test"), {
        message: "Hello from Macro Tracker!",
        timestamp: new Date().toISOString(),
      });
      setStatus(`✅ Firestore write successful! Doc ID: ${docRef.id}`);
    } catch (error) {
      setStatus(`❌ Firestore error: ${error.message}`);
    }
  };

  // Test 5: Read from Firestore
  const testFirestoreRead = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "test"));
      const docs = querySnapshot.docs.map((doc) => doc.data());
      setStatus(`✅ Firestore read successful! Found ${docs.length} documents`);
      console.log("Documents:", docs);
    } catch (error) {
      setStatus(`❌ Firestore read error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Firebase Connection Test
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={testConnection}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            1. Test Connection
          </button>

          <button
            onClick={testCreateUser}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            2. Create Test User
          </button>

          <button
            onClick={testLogin}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            3. Login Test User
          </button>

          <button
            onClick={testFirestore}
            className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition"
          >
            4. Write to Firestore
          </button>

          <button
            onClick={testFirestoreRead}
            className="bg-pink-600 text-white px-4 py-3 rounded-lg hover:bg-pink-700 transition col-span-full"
          >
            5. Read from Firestore
          </button>
        </div>

        {status && (
          <div
            className={`p-4 rounded-lg ${status.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <p className="font-mono text-sm">{status}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-900 mb-2">
            Test Instructions:
          </h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Click "Test Connection" - should see success message</li>
            <li>
              Click "Create Test User" - creates a new user in Firebase Auth
            </li>
            <li>Click "Login Test User" - logs in with the created user</li>
            <li>Click "Write to Firestore" - writes test data to Firestore</li>
            <li>Click "Read from Firestore" - reads the test data back</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestFirebase;
