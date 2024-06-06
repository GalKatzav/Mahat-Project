import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import reportWebVitals from "./reportWebVitals";
import HomePage from "./components/screens/HomePage";
import AboutMe from "./components/screens/AboutMe";
import AddDonation from "./components/screens/AddDonation";
import ConnectUs from "./components/screens/ConnectUs";
import SearchDonations from "./components/screens/SearchDonations";
import LogIn from "./components/screens/LogIn";
import Registertion from "./components/screens/Registertion";
import NotFound from "./components/screens/NotFound";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Settings from "./components/screens/Settings";
import Messages from "./components/screens/Messages";
import { UserProvider } from "../src/services/contexts/UserContext";
import ProtectedUserRoute from "../src/services/protectedRoute/ProtectedUserRoute";

ReactDOM.render(
  <UserProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Log_In" element={<LogIn />} />
        <Route path="/Registertion" element={<Registertion />} />

        <Route
          path="/About_Me"
          element={
            <ProtectedUserRoute>
              <AboutMe />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/Add_Donation"
          element={
            <ProtectedUserRoute>
              <AddDonation />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/Connect_Us"
          element={
            <ProtectedUserRoute>
              <ConnectUs />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/Donations_Search"
          element={
            <ProtectedUserRoute>
              <SearchDonations />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/Settings"
          element={
            <ProtectedUserRoute>
              <Settings />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/Messages"
          element={
            <ProtectedUserRoute>
              <Messages />
            </ProtectedUserRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </UserProvider>,
  document.getElementById("root")
);
