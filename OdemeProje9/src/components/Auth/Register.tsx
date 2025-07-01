import React, { useState } from "react";
import { register } from "../../api/paythor";

interface RegisterProps {
  onLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
    merchant_name: "",
    merchant_company: "",
    merchant_email: "",
    merchant_phone: "",
    merchant_country: "tr"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const result = await register({
        user: {
          firstname: form.firstname,
          lastname: form.lastname,
          phone: form.phone,
          email: form.email,
          password: form.password
        },
        merchant: {
          program_id: 1,
          name: form.merchant_name,
          company: form.merchant_company,
          email: form.merchant_email,
          phone: form.merchant_phone,
          country: form.merchant_country,
          lang: "tr"
        }
      });
      if (result.status === "success") {
        setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
      } else {
        setError(result.message || "Kayıt başarısız");
      }
    } catch (err) {
      setError("Bir hata oluştu");
    }
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstname" placeholder="Ad" value={form.firstname} onChange={handleChange} required />
        <input name="lastname" placeholder="Soyad" value={form.lastname} onChange={handleChange} required />
        <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} required />
        <input name="email" placeholder="E-posta" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Şifre" value={form.password} onChange={handleChange} required />
        <input name="merchant_name" placeholder="Mağaza Adı" value={form.merchant_name} onChange={handleChange} required />
        <input name="merchant_company" placeholder="Şirket Adı" value={form.merchant_company} onChange={handleChange} required />
        <input name="merchant_email" placeholder="Mağaza E-posta" value={form.merchant_email} onChange={handleChange} required />
        <input name="merchant_phone" placeholder="Mağaza Telefon" value={form.merchant_phone} onChange={handleChange} required />
        <input name="merchant_country" placeholder="Ülke (tr)" value={form.merchant_country} onChange={handleChange} required />
        <button type="submit" disabled={loading}>{loading ? "Kayıt Olunuyor..." : "Kayıt Ol"}</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <button onClick={onLogin}>Giriş Yap</button>
    </div>
  );
};

export default Register; 