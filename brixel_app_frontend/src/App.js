import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Menu from "./components/Menu/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage";
import Workbench from "./pages/Workbench";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header/Header";


function App() {
  return (
    <div className="App container">
      <AuthProvider>
        <Router>
          <Header></Header>
          <Menu />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/workbench" element={<Workbench />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
