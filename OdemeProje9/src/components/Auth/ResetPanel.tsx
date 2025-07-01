import React, { useState } from "react";

interface ResetPanelProps {
  email: string;
  phone: string;
  onLogin: () => void;
}

const ResetPanel: React.FC<ResetPanelProps> = ({ email: initialEmail, phone: initialPhone, onLogin }) => {
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Yeni şifreniz en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("https://api.paythor.com/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetpassword: {
            email: email,
            phone: phone,
            otp_code: otp,
            new_password: newPassword
          }
        })
      });
      const data = await response.json();
      if (data.status === "success") {
        setSuccess("Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.");
        setTimeout(onLogin, 1500);
      } else {
        setError(data.message || "Şifre sıfırlanamadı.");
      }
    } catch (e: any) {
      setError(e.message || "Bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2>Şifre Sıfırla</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="text" placeholder="Telefon" value={phone} onChange={e => setPhone(e.target.value)} required />
        <input type="text" placeholder="OTP Kodu" value={otp} onChange={e => setOtp(e.target.value)} required />
        <input type="password" placeholder="Yeni Şifre" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <button onClick={onLogin}>Girişe Dön</button>
    </div>
  );
};

export default ResetPanel; 