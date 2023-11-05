import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SigninForm from "./_auth/forms/SigninForm";
import Home from "./_root/pages/Home";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "./components/ui/toaster";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";

function App() {
  const {currentUser, userData } = useContext(AuthContext);
  console.log(userData, currentUser)
  return (
    <BrowserRouter>
      <main className="flex h-screen">
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/sign-in" element={<SigninForm />} />
            <Route path="/sign-up" element={<SignUpForm />} />
          </Route>
          {/* Private Routes */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
        <Toaster/>
      </main>
    </BrowserRouter>
  );
}

export default App;
