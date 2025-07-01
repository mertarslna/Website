import React, { useState } from "react";
import LoginPanel from "./components/LoginPanel";
import RegisterPanel from "./components/RegisterPanel";
import OtpPanel from "./components/OtpPanel";
import PaymentPanel from "./components/PaymentPanel";
import ForgotPanel from "./components/ForgotPanel";
import ResetPanel from "./components/ResetPanel";

type Panel = "login" | "register" | "otp" | "payment" | "forgot" | "reset";

function App() {
  const [panel, setPanel] = useState<Panel>("login");
  const [email, setEmail] = useState("");
  const [sessionToken, setSessionToken] = useState(localStorage.getItem("paythor_session_token") || "");
  const [pendingToken, setPendingToken] = useState(""); // login sonrası OTP için
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");

  // Panel geçişleri
  const showLogin = () => setPanel("login");
  const showRegister = () => setPanel("register");
  const showOtp = () => setPanel("otp");
  const showPayment = () => setPanel("payment");
  const showForgot = () => setPanel("forgot");
  const showReset = () => setPanel("reset");

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

  // Şifremi unuttum sonrası
  const handleForgot = (email: string, phone: string) => {
    setForgotEmail(email);
    setForgotPhone(phone);
    setPanel("reset");
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", background: "#fff", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 32 }}>
      <h2 style={{ textAlign: "center" }}>Paythor Ödeme Sistemi</h2>
      {panel === "login" && (
        <LoginPanel
          onLoginSuccess={handleLoginSuccess}
          onShowRegister={showRegister}
          onShowForgot={showForgot}
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
      {panel === "forgot" && (
        <ForgotPanel
          onShowLogin={showLogin}
          onForgot={handleForgot}
        />
      )}
      {panel === "reset" && (
        <ResetPanel
          email={forgotEmail}
          phone={forgotPhone}
          onShowLogin={showLogin}
        />
      )}
    </div>
  );
}

export default App;
