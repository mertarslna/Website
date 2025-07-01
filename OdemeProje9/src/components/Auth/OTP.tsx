import React, { useState } from "react";
import { otpVerify } from "../../api/paythor";
import { useAuth } from "../../context/AuthContext";

interface OTPProps {
  onSuccess: () => void;
}

const OTP: React.FC<OTPProps> = ({ onSuccess }) => {
  const { setToken } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const email = localStorage.getItem("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await otpVerify({ target: email, otp });
      if (result.status === "success" && result.data && result.data.token_string) {
        setToken(result.data.token_string);
        localStorage.setItem("token", result.data.token_string);
        onSuccess();
      } else if (result.status === "success") {
        onSuccess();
      } else {
        setError(result.message || "Doğrulama başarısız");
      }
    } catch (err) {
      setError("Bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2>OTP Doğrulama</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="OTP Kodu" value={otp} onChange={e => setOtp(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Doğrulanıyor..." : "Doğrula"}</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default OTP; 