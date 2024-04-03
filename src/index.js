import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./components/screens/HomePage";
import AboutMe from "./components/screens/AboutMe";
import AddDonation from "./components/screens/AddDonation";
import ConnectUs from "./components/screens/ConnectUs";
import SearchDonations from "./components/screens/SearchDonations";
import LogIn from "./components/screens/LogIn";
import Registertion from "./components/screens/Registertion";
import NotFound from "./components/screens/NotFound";
import Footer from "./components/footer/Footer";

ReactDOM.render(
  <BrowserRouter>
    <Footer />
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Route for Home page */}
        <Route path="/About_Me" element={<AboutMe />} />
        <Route path="/Add_Donation" element={<AddDonation />} />
        <Route path="/Connect_Us" element={<ConnectUs />} />
        <Route path="/Donations_Search" element={<SearchDonations />} />
        <Route path="/Log_In" element={<LogIn />} />
        <Route path="/Registertion" element={<Registertion />} />
        <Route path="*" element={<NotFound />} />{" "}
        {/* Route for handling 404 errors */}
      </Routes>
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
