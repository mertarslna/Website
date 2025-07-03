const API_BASE = "https://api.paythor.com";

let sessionToken = "";

// Sayfa yüklendiğinde tokenı localStorage'dan çek
(function () {
  sessionToken = localStorage.getItem("paythor_session_token") || "";
})();

// Kayıt işlemi
async function register() {
  const firstname = document.getElementById("reg-firstname").value;
  const lastname = document.getElementById("reg-lastname").value;
  const email = document.getElementById("reg-email").value;
  const phone = document.getElementById("reg-phone").value;
  const password = document.getElementById("reg-password").value;
  const merchantName = document.getElementById("reg-merchant-name").value;
  const merchantCompany = document.getElementById("reg-merchant-company").value;
  const merchantEmail = document.getElementById("reg-merchant-email").value;
  const merchantPhone = document.getElementById("reg-merchant-phone").value;
  const merchantWeb = document.getElementById("reg-merchant-web").value;
  const merchantCountry = document.getElementById("reg-merchant-country").value;

  if (!firstname || !lastname || !email || !phone || !password || !merchantName || !merchantCompany || !merchantEmail || !merchantPhone || !merchantCountry) {
    alert("Lütfen tüm zorunlu alanları doldurun.");
    return;
  } // Zorunlu alanları kontrol et
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    alert("Şifreniz en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir.");
    return;
  } // Şifre formatını kontrol et

  // API'ye gönderilecek kullanıcı ve mağaza bilgilerini hazırla
  const body = {
    user: { firstname, lastname, phone, email, password },
    merchant: {
      program_id: 1,
      name: merchantName,
      company: merchantCompany,
      email: merchantEmail,
      phone: merchantPhone,
      country: merchantCountry,
      lang: "tr_TR"
    } 
  };
  if (merchantWeb) body.merchant.web = merchantWeb; // Web adresi varsa ekle

  // Kayıt isteğini API'ye gönder
  const response = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body) 
  });

  const data = await response.json();
  alert("Kayıt durumu: " + JSON.stringify(data));
}

// Giriş işlemi
async function login() {
  // Kullanıcıdan e-posta ve şifreyi al
  const email = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  // API'ye gönderilecek giriş bilgilerini hazırla
  const body = {
    auth_query: {
      auth_method: "email_password_panel",
      email,
      password,
      program_id: 1,
      app_id: 102,
    }
  };

  // Giriş isteğini API'ye gönder
  const response = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (data.status === "success" && data.data && data.data.token_string) {
    sessionToken = data.data.token_string;
    // Sadece değişkende tut, localStorage'a yazma!
    document.getElementById("otp").style.display = "block";
    alert("Giriş başarılı! Lütfen e-posta adresinize gelen OTP kodunu doğrulayın.");
  } else {
    alert("Giriş başarısız: " + JSON.stringify(data));
  }
}

// OTP doğrulama işlemi
async function verifyOtp() {
  // Kullanıcıdan OTP kodunu ve e-posta adresini al
  const otp = document.getElementById("otp-code").value;
  const email = document.getElementById("login-username").value;

  if (!email) {
    alert("Önce giriş e-posta adresinizi giriniz.");
    return;
  }
  if (!otp) {
    alert("OTP kodunu giriniz.");
    return;
  }

  // API'ye gönderilecek OTP doğrulama verisini hazırla
  const body = { target: email, otp };

  // OTP doğrulama isteğini API'ye gönder
  const response = await fetch(`${API_BASE}/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (data.status === "success" && data.data && data.data.token_string) {
    // OTP doğrulama başarılıysa, dönen tokenı localStorage'a kaydet
    sessionToken = data.data.token_string;
    localStorage.setItem("paythor_session_token", sessionToken);
    alert("OTP doğrulama başarılı!");
    window.location.href = "payment.html";
  } else if (data.status === "success") {
    // Bazı API'lerde token_string dönmeyebilir, login'den geleni kullanmak gerekebilir
    if (sessionToken) {
      localStorage.setItem("paythor_session_token", sessionToken);
    }
    alert("OTP doğrulama başarılı!");
    window.location.href = "payment.html";
  } else if (data.message && data.message.includes("OTP limit exceeded")) {
    document.getElementById("otp").style.display = "none";
    alert("Çok fazla yanlış OTP girdiniz veya limit aşıldı. Lütfen 5 dakika sonra tekrar giriş yaparak yeni OTP kodu alın.");
  } else {
    alert("OTP doğrulama başarısız: " + JSON.stringify(data));
  }
}

// Oturumu sıfırlamak için fonksiyon (isteğe bağlı)
function logout() {
  sessionToken = "";
  localStorage.removeItem("paythor_session_token");
  // Gerekirse yönlendirme veya arayüz güncellemesi ekleyin
}

// Ödeme oluşturma işlemi
async function createPayment() {
  // Tokenı localStorage'dan oku
  const token = localStorage.getItem("paythor_session_token") || "";
  if (!token) {
    alert("Oturum doğrulaması başarısız. Lütfen tekrar giriş yapınız.");
    return;
  }

  // Sepet (cart) ürünlerini cartData'dan topla ve toplamı hesapla
  const cart = [];
  let total = 0;
  for (let i = 0; i < cartData.length; i++) {
    const obj = cartData[i];
    const price = parseFloat(obj.price) || 0;
    const qty = parseFloat(obj.quantity) || 0;
    if (obj.type === "discount") {
      total -= price * qty;
    } else {
      total += price * qty;
    }
    cart.push({
      id: obj.id,
      name: obj.name,
      type: obj.type,
      price: obj.price,
      quantity: Number(obj.quantity)
    });
  }
  const amount = total.toFixed(2);

  // Alıcı ve diğer bilgiler formdan alınır
  const payerFirstName = document.getElementById("payer-firstname")?.value || "Ahmet";
  const payerLastName = document.getElementById("payer-lastname")?.value || "Cinar";
  const payerEmail = document.getElementById("payer-email")?.value || "ahmet.cinar@example.com";
  const payerPhone = document.getElementById("payer-phone")?.value || "5000000000";
  const payerAddress = document.getElementById("payer-address")?.value || "123 Main St";
  const payerCity = document.getElementById("payer-city")?.value || "Istanbul";
  const payerState = document.getElementById("payer-state")?.value || "Istanbul";
  const payerPostal = document.getElementById("payer-postal")?.value || "07050";
  const payerCountry = document.getElementById("payer-country")?.value || "TR";
  const payerIp = document.getElementById("payer-ip")?.value || "127.0.0.1";

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert("Lütfen geçerli bir tutar giriniz.");
    return;
  }

  // API'ye gönderilecek header bilgilerini hazırla
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  // API'ye gönderilecek ödeme, alıcı ve sipariş bilgilerini hazırla
  const raw = JSON.stringify({
    payment: {
      amount: amount,
      currency: "TRY",
      buyerFee: "0",
      method: "creditcard",
      merchantReference: "ORDER-123"
    },
    payer: {
      first_name: payerFirstName,
      last_name: payerLastName,
      email: payerEmail,
      phone: payerPhone,
      address: {
        line_1: payerAddress,
        city: payerCity,
        state: payerState,
        postal_code: payerPostal,
        country: payerCountry
      },
      ip: payerIp
    },
    order: {
      cart, // dinamik ürün listesi
      shipping: {
        first_name: document.getElementById("shipping-firstname").value || "John",
        last_name: document.getElementById("shipping-lastname").value || "Doe",
        phone: document.getElementById("shipping-phone").value || "5000000000",
        email: document.getElementById("shipping-email").value || "john.doe@example.com",
        address: {
          line_1: document.getElementById("shipping-address").value || "456 Vasm St",
          city: document.getElementById("shipping-city").value || "Los Angeles",
          state: document.getElementById("shipping-state").value || "Los Angeles",
          postal_code: document.getElementById("shipping-postal").value || "08500",
          country: document.getElementById("shipping-country").value || "USA"
        }
      },
      invoice: {
        id: document.getElementById("invoice-id").value || "cart_hash_123",
        first_name: document.getElementById("invoice-firstname").value || "John",
        last_name: document.getElementById("invoice-lastname").value || "Doe",
        price: amount, // fatura fiyatı otomatik toplam
        quantity: Number(document.getElementById("invoice-quantity").value) || 1
      }
    }
  });

  // Ödeme oluşturma isteğini API'ye gönder
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("https://api.paythor.com/payment/create", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      try {
        const data = JSON.parse(result);
        if (data.status === "success" && data.data && data.data.payment_link) {
          // Başarılıysa ödeme linkini ve detay butonunu göster
          document.getElementById("payment-link").innerHTML =
            `Ödeme Linki: <a href="${data.data.payment_link}" target="_blank">${data.data.payment_link}</a>
            <br>
            <button onclick="getPaymentDetails('${data.data.payment_token}')">Detayları Göster</button>
            <div id="payment-details"></div>`;
        } else {
          // Hata mesajını göster
          let errMsg = data && data.message ? data.message : "Link oluşturulamadı veya hata oluştu.";
          if (data && data.details && data.details.length) {
            errMsg += "\n" + JSON.stringify({ details: data.details }, null, 2);
          }
          alert(errMsg);
        }
      } catch (e) {
        alert("Yanıt ayrıştırılamadı: " + result);
      }
    })
    .catch((error) => {
      alert("Bir hata oluştu: " + error.message);
      console.error(error);
    });
}

// Ödeme detaylarını getir
async function getPaymentDetails(paymentToken) {
  // API'den ödeme detaylarını çek
  const response = await fetch(`${API_BASE}/payment/getbytoken/${paymentToken}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  const data = await response.json();
  if (data && data.data) {
    // Detayları ekranda göster
    document.getElementById("payment-details").innerText =
      "Ödeme Detayları: " + JSON.stringify(data.data, null, 2);
  } else if (data && data.message) {
    document.getElementById("payment-details").innerText =
      "Detaylar alınamadı: " + data.message;
  } else {
    document.getElementById("payment-details").innerText =
      "Detaylar alınamadı: " + JSON.stringify(data);
  }
}

// Şifremi Unuttum (Forgot Password)
async function forgotPassword() {
  const email = document.getElementById("forgot-email").value;
  const phone = document.getElementById("forgot-phone").value;
  if (!email || !phone) {
    alert("Lütfen e-posta ve telefon giriniz.");
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
    const response = await fetch("https://api.paythor.com/auth/forgot-password", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    });
    const data = await response.json();
    if (data.status === "success") {
      alert("Şifre sıfırlama kodu gönderildi. Lütfen e-posta veya SMS'inizi kontrol edin.");
      // Reset ekranına geç
      document.getElementById("reset-email").value = email;
      document.getElementById("reset-phone").value = phone;
      if (typeof showResetPassword === "function") showResetPassword();
    } else {
      alert("Hata: " + (data.message || "Kod gönderilemedi."));
    }
  } catch (e) {
    alert("Hata: " + (e.message || e));
  }
}

// Şifre Sıfırla (Reset Password)
async function resetPassword() {
  const email = document.getElementById("reset-email").value;
  const phone = document.getElementById("reset-phone").value;
  const otp = document.getElementById("reset-otp").value;
  const newPassword = document.getElementById("reset-new-password").value;
  if (!email || !phone || !otp || !newPassword) {
    alert("Lütfen tüm alanları doldurun.");
    return;
  }
  // Şifre format kontrolü (opsiyonel)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    alert("Yeni şifreniz en az 8 karakter olmalı ve büyük harf, küçük harf, rakam ve özel karakter içermelidir.");
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
    const response = await fetch("https://api.paythor.com/auth/reset-password", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    });
    const data = await response.json();
    if (data.status === "success") {
      alert("Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.");
      if (typeof showLogin === "function") showLogin();
    } else {
      alert("Hata: " + (data.message || "Şifre sıfırlanamadı."));
    }
  } catch (e) {
    alert("Hata: " + (e.message || e));
  }
}

// Kullanıcı listesini çek ve göster
async function listUsers(page = 1, itemsPerPage = 20, orderBy = "id", orderWay = "ASC") {
  const token = localStorage.getItem("paythor_session_token") || "";
  if (!token) {
    alert("Oturum doğrulaması başarısız. Lütfen tekrar giriş yapınız.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    pagination: {
      page: page,
      items_per_page: itemsPerPage,
      order_by: orderBy,
      order_way: orderWay
    }
  });

  try {
    const response = await fetch("https://api.paythor.com/user/list", {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    });
    const data = await response.json();
    if (data.status === "success" && Array.isArray(data.data)) {
      renderUserList(data.data);
    } else {
      alert("Kullanıcı listesi alınamadı: " + (data.message || "Bilinmeyen hata"));
    }
  } catch (e) {
    alert("Kullanıcı listesi alınamadı: " + (e.message || e));
  }
}

// Kullanıcı listesini tablo olarak ekrana bas
function renderUserList(users) {
  const container = document.getElementById("user-list-container");
  if (!container) return;
  if (!users.length) {
    container.innerHTML = "<p>Kullanıcı bulunamadı.</p>";
    return;
  }
  let html = `<table border="1" cellpadding="5" style="border-collapse:collapse;">
    <thead>
      <tr>
        <th>ID</th>
        <th>Ad</th>
        <th>Soyad</th>
        <th>Email</th>
        <th>Telefon</th>
        <th>Durum</th>
      </tr>
    </thead>
    <tbody>
  `;
  users.forEach(u => {
    html += `<tr>
      <td>${u.id || ""}</td>
      <td>${u.firstname || ""}</td>
      <td>${u.lastname || ""}</td>
      <td>${u.email || ""}</td>
      <td>${u.phone || ""}</td>
      <td>${u.status || ""}</td>
    </tr>`;
  });
  html += "</tbody></table>";
  container.innerHTML = html;
}

// Ödeme panelini gösteren fonksiyon (arayüzde çağrılır)
function showPayment() {
  const token = localStorage.getItem("paythor_session_token") || "";
  if (!token) {
    alert("Lütfen önce giriş yapınız.");
    showLogin();
    return;
  }
  document.getElementById('login').classList.add('hidden');
  document.getElementById('register').classList.add('hidden');
  document.getElementById('otp').classList.add('hidden');
  document.getElementById('forgot-password').classList.add('hidden');
  document.getElementById('reset-password').classList.add('hidden');
  document.getElementById('payment').classList.remove('hidden');
  if (document.getElementById('user-list-panel'))
    document.getElementById('user-list-panel').classList.add('hidden');
}