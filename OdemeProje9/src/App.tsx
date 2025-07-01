import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OTP from "./components/Auth/OTP";
import PaymentPanel from "./components/Payment/PaymentPanel";
import ForgotPanel from "./components/Auth/ForgotPanel";
import ResetPanel from "./components/Auth/ResetPanel";

const AppContent = () => {
  const { token, setToken } = useAuth();
  const [step, setStep] = useState<"login" | "register" | "otp" | "payment" | "forgot" | "reset">("login");
  const [resetInfo, setResetInfo] = useState<{ email: string; phone: string }>({ email: "", phone: "" });

  // Uygulama ilk açıldığında token'ı temizle
  useEffect(() => {
    localStorage.removeItem("token");
    setToken(null);
    setStep("login");
    // eslint-disable-next-line
  }, []);

  // Oturum kapatıldığında login ekranına dön
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setStep("login");
  };

  if (!token) {
    if (step === "login") return <Login onRegister={() => setStep("register")} onOTP={() => setStep("otp")} onForgot={() => setStep("forgot")} />;
    if (step === "register") return <Register onLogin={() => setStep("login")} />;
    if (step === "otp") return <OTP onSuccess={() => setStep("payment")} />;
    if (step === "forgot") return <ForgotPanel onReset={(email, phone) => { setResetInfo({ email, phone }); setStep("reset"); }} onLogin={() => setStep("login")} />;
    if (step === "reset") return <ResetPanel email={resetInfo.email} phone={resetInfo.phone} onLogin={() => setStep("login")} />;
  }
  return <PaymentPanel onLogout={handleLogout} />;
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App; 