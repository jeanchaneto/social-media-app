import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SigninForm from "./_auth/forms/SigninForm";
import Home from "./_root/pages/Home";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "./components/ui/toaster";
import Saved from "./_root/pages/Saved";
import AllUsers from "./_root/pages/AllUsers";
import CreatePost from "./_root/pages/CreatePost";
import EditPost from "./_root/pages/EditPost";
import Profile from "./_root/pages/Profile";
import UpdateProfile from "./_root/pages/UpdateProfile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
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
            <Route index element={ <PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/saved" element={<PrivateRoute><Saved /></PrivateRoute>} />
            <Route path="/all-users" element={<PrivateRoute><AllUsers /></PrivateRoute>} />
            <Route path="/create-post" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/update-post/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />
            <Route path="/profile/:id/*" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/update-profile/:id" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
          </Route>
        </Routes>
        <Toaster />
      </main>
    </BrowserRouter>
  );
}

export default App;
