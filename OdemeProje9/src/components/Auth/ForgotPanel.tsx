import React, { useState } from "react";

interface ForgotPanelProps {
  onReset: (email: string, phone: string) => void;
  onLogin: () => void;
}

const ForgotPanel: React.FC<ForgotPanelProps> = ({ onReset, onLogin }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("https://api.paythor.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forgotpassword: {
            email: email,
            phone: phone
          }
        })
      });
      const data = await response.json();
      if (data.status === "success") {
        setSuccess("Şifre sıfırlama kodu gönderildi. Lütfen e-posta veya SMS'inizi kontrol edin.");
        onReset(email, phone);
      } else {
        setError(data.message || "Kod gönderilemedi.");
      }
    } catch (e: any) {
      setError(e.message || "Bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2>Şifremi Unuttum</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="text" placeholder="Telefon" value={phone} onChange={e => setPhone(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Gönderiliyor..." : "Şifre Sıfırlama Kodu Gönder"}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <button onClick={onLogin}>Girişe Dön</button>
    </div>
  );
};

export default ForgotPanel; 