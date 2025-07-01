import React, { useState } from "react";

interface Props {
  onShowLogin: () => void;
}

const API_BASE = "https://api.paythor.com";

const RegisterPanel: React.FC<Props> = ({ onShowLogin }) => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    merchantName: "",
    merchantCompany: "",
    merchantEmail: "",
    merchantPhone: "",
    merchantWeb: "",
    merchantCountry: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    if (
      !form.firstname || !form.lastname || !form.email || !form.phone || !form.password ||
      !form.merchantName || !form.merchantCompany || !form.merchantEmail || !form.merchantPhone || !form.merchantCountry
    ) {
      alert("Lütfen tüm zorunlu alanları doldurun.");
      setLoading(false);
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      alert("Şifreniz en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir.");
      setLoading(false);
      return;
    }
    const body: any = {
      user: {
        firstname: form.firstname,
        lastname: form.lastname,
        phone: form.phone,
        email: form.email,
        password: form.password
      },
      merchant: {
        program_id: 1,
        name: form.merchantName,
        company: form.merchantCompany,
        email: form.merchantEmail,
        phone: form.merchantPhone,
        country: form.merchantCountry,
        lang: "tr_TR"
      }
    };
    if (form.merchantWeb) body.merchant.web = form.merchantWeb;

    try {
      const response = await fetch(`${API_BASE}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      alert("Kayıt durumu: " + JSON.stringify(data));
      if (data.status === "success") onShowLogin();
    } catch (e: any) {
      alert("Hata: " + (e.message || e));
    }
    setLoading(false);
  };

  return (
    <div>
      <label>Ad <input name="firstname" value={form.firstname} onChange={handleChange} disabled={loading} /></label>
      <label>Soyad <input name="lastname" value={form.lastname} onChange={handleChange} disabled={loading} /></label>
      <label>E-posta <input name="email" value={form.email} onChange={handleChange} disabled={loading} /></label>
      <label>Telefon <input name="phone" value={form.phone} onChange={handleChange} disabled={loading} /></label>
      <label>Şifre <input name="password" type="password" value={form.password} onChange={handleChange} disabled={loading} /></label>
      <label>Mağaza Adı <input name="merchantName" value={form.merchantName} onChange={handleChange} disabled={loading} /></label>
      <label>Şirket Adı <input name="merchantCompany" value={form.merchantCompany} onChange={handleChange} disabled={loading} /></label>
      <label>Mağaza E-posta <input name="merchantEmail" value={form.merchantEmail} onChange={handleChange} disabled={loading} /></label>
      <label>Mağaza Telefon <input name="merchantPhone" value={form.merchantPhone} onChange={handleChange} disabled={loading} /></label>
      <label>Web Sitesi (opsiyonel) <input name="merchantWeb" value={form.merchantWeb} onChange={handleChange} disabled={loading} /></label>
      <label>Ülke Kodu <input name="merchantCountry" value={form.merchantCountry} onChange={handleChange} disabled={loading} /></label>
      <button onClick={handleRegister} disabled={loading}>Kayıt Ol</button>
      <div style={{ marginTop: 12 }}>
        <button onClick={onShowLogin} style={{ background: "none", color: "#4CAF50", border: "none", cursor: "pointer", textDecoration: "underline" }}>
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default RegisterPanel;
