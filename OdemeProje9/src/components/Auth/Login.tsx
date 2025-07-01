import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../api/paythor";

interface LoginProps {
  onRegister: () => void;
  onOTP: () => void;
  onForgot: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegister, onOTP, onForgot }) => {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login({
        auth_method: "email_password_panel",
        email,
        password,
        program_id: 1,
        app_id: 102,
        store_url: ""
      });
      if (result.status === "success" && result.data.token_string) {
        setToken(result.data.token_string);
        localStorage.setItem("token", result.data.token_string);
      }
      if (result.status === "success" && result.data.status === "validation") {
        localStorage.setItem("email", email);
        onOTP();
      } else if (result.status !== "success") {
        setError(result.message || "Giriş başarısız");
      }
    } catch (err) {
      setError("Bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</button>
      </form>
      {error && <div className="error">{error}</div>}
      <button onClick={onRegister}>Kayıt Ol</button>
      <button onClick={onForgot}>Şifremi Unuttum</button>
    </div>
  );
};

export default Login; 