import React, { useState } from "react";

interface Props {
  onShowLogin: () => void;
  onForgot: (email: string, phone: string) => void;
}

const API_BASE = "https://api.paythor.com";

const ForgotPanel: React.FC<Props> = ({ onShowLogin, onForgot }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    setLoading(true);
    if (!email || !phone) {
      alert("Lütfen e-posta ve telefon giriniz.");
      setLoading(false);
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      forgotpassword: {
        email: email,
        phone: phone
      }
    });
    try {
      const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      });
      const data = await response.json();
      if (data.status === "success") {
        alert("Şifre sıfırlama kodu gönderildi. Lütfen e-posta veya SMS'inizi kontrol edin.");
        onForgot(email, phone);
      } else {
        alert("Hata: " + (data.message || "Kod gönderilemedi."));
      }
    } catch (e: any) {
      alert("Hata: " + (e.message || e));
    }
    setLoading(false);
  };

  return (
    <div>
      <label>
        E-posta
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
      </label>
      <label>
        Telefon
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} disabled={loading} />
      </label>
      <button onClick={handleForgot} disabled={loading}>Şifre Sıfırlama Kodu Gönder</button>
      <div style={{ marginTop: 12 }}>
        <button onClick={onShowLogin} style={{ background: "none", color: "#4CAF50", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Girişe Dön
        </button>
      </div>
    </div>
  );
};

export default ForgotPanel;
