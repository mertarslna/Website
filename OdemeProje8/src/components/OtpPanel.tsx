import React, { useState } from "react";

interface Props {
  email: string;
  pendingToken: string;
  onOtpSuccess: (token: string) => void;
  onShowLogin: () => void;
}

const API_BASE = "https://api.paythor.com";

const OtpPanel: React.FC<Props> = ({ email, pendingToken, onOtpSuccess, onShowLogin }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const body = { target: email, otp };
      const response = await fetch(`${API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (data.status === "success" && data.data && data.data.token_string) {
        alert("OTP doğrulama başarılı!");
        onOtpSuccess(data.data.token_string);
      } else if (data.status === "success") {
        // Bazı API'lerde token_string dönmeyebilir, login'den geleni kullanmak gerekebilir
        if (pendingToken) {
          onOtpSuccess(pendingToken);
        } else {
          alert("OTP doğrulama başarılı fakat token alınamadı.");
        }
      } else {
        alert("OTP doğrulama başarısız: " + (data.message || "Bilinmeyen hata"));
      }
    } catch (e: any) {
      alert("Hata: " + (e.message || e));
    }
    setLoading(false);
  };

  return (
    <div>
      <label>
        OTP Kodu
        <input type="text" value={otp} onChange={e => setOtp(e.target.value)} disabled={loading} />
      </label>
      <button onClick={handleVerify} disabled={loading}>Doğrula</button>
      <div style={{ marginTop: 12 }}>
        <button onClick={onShowLogin} style={{ background: "none", color: "#4CAF50", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Girişe Dön
        </button>
      </div>
    </div>
  );
};

export default OtpPanel;
