import React, { useState } from "react";

interface Props {
  onLoginSuccess: (token: string, email: string) => void;
  onShowRegister: () => void;
}

const API_BASE = "https://api.paythor.com";

const LoginPanel: React.FC<Props> = ({ onLoginSuccess, onShowRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const body = {
        auth_query: {
          auth_method: "email_password_panel",
          email,
          password,
          program_id: 1,
          app_id: 102,
        }
      };
      const response = await fetch(`${API_BASE}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (data.status === "success" && data.data && data.data.token_string) {
        alert("Giriş başarılı! Lütfen OTP kodunu girin.");
        onLoginSuccess(data.data.token_string, email);
      } else {
        alert("Giriş başarısız: " + (data.message || "Bilinmeyen hata"));
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
        Şifre
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
      </label>
      <button onClick={handleLogin} disabled={loading}>Giriş Yap</button>
      <div style={{ marginTop: 12 }}>
        <button onClick={onShowRegister} style={{ background: "none", color: "#4CAF50", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Kayıt Ol
        </button>
      </div>
    </div>
  );
};

export default LoginPanel;
