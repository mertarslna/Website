import * as React from "react";
import { useState } from "react";
import LoginPanel from "./components/LoginPanel";
import RegisterPanel from "./components/RegisterPanel";
import OtpPanel from "./components/OtpPanel";
import PaymentPanel from "./components/PaymentPanel";

type Panel = "login" | "register" | "otp" | "payment";

function App() {
  const [panel, setPanel] = useState<Panel>("login");
  const [email, setEmail] = useState("");
  const [sessionToken, setSessionToken] = useState(localStorage.getItem("paythor_session_token") || "");
  const [pendingToken, setPendingToken] = useState(""); // login sonrası OTP için

  // Panel geçişleri
  const showLogin = () => setPanel("login");
  const showRegister = () => setPanel("register");
  const showOtp = () => setPanel("otp");
  const showPayment = () => setPanel("payment");

  // Giriş sonrası
  const handleLoginSuccess = (token: string, email: string) => {
    setPendingToken(token);
    setEmail(email);
    setPanel("otp");
  };

  // OTP sonrası
  const handleOtpSuccess = (token: string) => {
    setSessionToken(token);
    localStorage.setItem("paythor_session_token", token);
    setPanel("payment");
  };

  // Çıkış
  const handleLogout = () => {
    setSessionToken("");
    setPendingToken("");
    localStorage.removeItem("paythor_session_token");
    setPanel("login");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", background: "#fff", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ textAlign: "center" }}>Paythor Ödeme Sistemi</h2>
      {panel === "login" && (
        <LoginPanel
          onLoginSuccess={handleLoginSuccess}
          onShowRegister={showRegister}
        />
      )}
      {panel === "register" && (
        <RegisterPanel
          onShowLogin={showLogin}
        />
      )}
      {panel === "otp" && (
        <OtpPanel
          email={email}
          pendingToken={pendingToken}
          onOtpSuccess={handleOtpSuccess}
          onShowLogin={showLogin}
        />
      )}
      {panel === "payment" && sessionToken && (
        <PaymentPanel
          sessionToken={sessionToken}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
