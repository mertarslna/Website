import React, { useState } from "react";

interface Props {
  email: string;
  phone: string;
  onShowLogin: () => void;
}

const API_BASE = "https://api.paythor.com";

const ResetPanel: React.FC<Props> = ({ email, phone, onShowLogin }) => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    if (!email || !phone || !otp || !newPassword) {
      alert("Lütfen tüm alanları doldurun.");
      setLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert("Yeni şifreniz en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir.");
      setLoading(false);
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      resetpassword: {
        email: email,
        phone: phone,
        otp_code: otp,
        new_password: newPassword
      }
    });
    try {
      const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.");
        onShowLogin();
      } else {
        alert("Hata: " + (data.message || "Şifre sıfırlanamadı."));
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
      <label>
        Yeni Şifre
        <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={loading} />
      </label>
      <button onClick={handleReset} disabled={loading}>Şifreyi Sıfırla</button>
      <div style={{ marginTop: 12 }}>
        <button onClick={onShowLogin} style={{ background: "none", color: "#4CAF50", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Girişe Dön
        </button>
      </div>
    </div>
  );
};

export default ResetPanel;
