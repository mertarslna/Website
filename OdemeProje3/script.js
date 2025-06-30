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
    alert("Önce giriş e-postanızı giriniz.");
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

  // Sadece amount kullanıcıdan alınır
  const amount = document.getElementById("amount").value;
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
      amount: Number(amount).toFixed(2),
      currency: "TRY",
      buyerFee: "0",
      method: "creditcard",
      merchantReference: "ORDER-123"
    },
    payer: {
      first_name: "Ahmet",
      last_name: "Cinar",
      email: "ahmet.cinar@example.com",
      phone: "5000000000",
      address: {
        line_1: "123 Main St",
        city: "Istanbul",
        state: "Istanbul",
        postal_code: "07050",
        country: "TR"
      },
      ip: "127.0.0.1"
    },
    order: {
      cart: [
        { id: "PRD-123", name: "Product Name", type: "product", price: "50.00", quantity: 2 },
        { id: "DSC-SUMMER2024", name: "SUMMER2024 (10%)", type: "discount", price: "5.00", quantity: 1 },
        { id: "SHIP-1234", name: "Shipping", type: "shipping", price: "10.00", quantity: 1 },
        { id: "TAX-TOTAL-5678", name: "Tax", type: "tax", price: "9.00", quantity: 1 }
      ],
      shipping: {
        first_name: "John",
        last_name: "Doe",
        phone: "5000000000",
        email: "john.doe@example.com",
        address: {
          line_1: "456 Vasm St",
          city: "Los Angeles", 
          state: "Los Angeles",
          postal_code: "08500",
          country: "USA"
        }
      },
      invoice: {
        id: "cart_hash_123",
        first_name: "John",
        last_name: "Doe",
        price: Number(amount).toFixed(2),
        quantity: 1
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