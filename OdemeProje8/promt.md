# Proje Promptu

Bu proje, Paythor API ile entegre çalışan bir ödeme yönetim panelidir. Temel özellikler:

- Kullanıcı kayıt, giriş ve OTP doğrulama işlemleri
- Şifremi unuttum ve şifre sıfırlama akışı
- Giriş yapan kullanıcılar için ödeme oluşturma paneli
- Oturum kontrolü: Giriş yapılmadan ödeme paneline erişilemez
- Arayüzde login, register, OTP, şifre sıfırlama ve ödeme panelleri arasında geçiş yapılabilir

Kullanılan teknolojiler:
- HTML, CSS, TypeScript, React js
- Paythor API endpointi (https://api.paythor.com)

Kullanıcı akışı:
1. Kullanıcı kayıt olur veya giriş yapar.
2. Giriş sonrası OTP doğrulaması yapılır.
3. Doğrulama sonrası ödeme paneli açılır.
4. Apiden dönen ödeme linki oluşturulur
5. Oturum kapatıldığında, tüm paneller gizlenir ve login ekranı gösterilir.

Kodda güvenlik ve erişim kontrolleri için localStorage'daki token kullanılır.

- Login: Sign-in (Get Accesstoken)
POST
Endpoint: https://api.paythor.com/auth/signin
Content-Type: application/json
This endpoint allows users to login to their account.

Request Parameters
Parameter	Type	Required	Description
auth_query.auth_method	string	Yes	
Authentication method (email_password or email_password_panel).

Note: email_password_panel should only be used for interface management purposes!

auth_query.email	string	Yes	User's email address
auth_query.password	string	Yes	User's password
auth_query.program_id	integer	Yes	ID of the program to login under
auth_query.app_id	integer	Yes	Application ID
auth_query.store_url	string	No	Store URL (if applicable)
After logging in, OTP verification is required before you can access your "Bearer token" information.

Example Request
How to call this endpoint in different languages

PHP
JavaScript
Python
const raw = JSON.stringify({
  auth_query: {
    auth_method: "email_password",
    email: "f.rizaergin@eticsoft.com",
    password: "12345678Aa.",
    program_id: 1,
    app_id: 102,
    store_url: ""
  }
});

const requestOptions = {
  method: "POST", 
  body: raw,
  redirect: "follow"
};

fetch("https://api.paythor.com/auth/signin", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
Response
Success Response (200 OK)
{
  "status": "success",
  "message": "Token created successfully.",
  "meta": {
    "timestamp": "2025-05-04 21:03:40",
    "request_id": "1969d1c9d84-154f",
    "code": 1
  },
  "data": {
    "token_string": "token_a0tzdlhKV1hzSmE2RzFzZ0JTaE9WaFM3Qkp3V0VwUzUzW124QXdJTWpNZ1NjbUk2S1dVR326UTRGU1EydnpXWHd4ckVTaThKdlVINkU0Njk1RitGRmc9PQ",
    "token_type": "time_limited",
    "expire_date": "2025-06-29 21:03:40",
    "status": "validation",
    "verification_method": "email",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "id_user": "user_YWtTSGQzc1JqRzFmeHQwZ0ZFL0JJQT09",
    "user_level": "admin",
    "last_login": "2025-05-04 21:03:41",
    "merchantname": "My Store",
    "app": 102
  }
}
Error Response (400 Bad Request)
{
  "status": "error",
  "message": "An error has occurred. You can access more detailed information using the details area.",
  "meta": {
    "timestamp": "2025-05-04 21:02:51",
    "request_id": "1969d1bdff1-25a5",
    "code": 1
  },
  "details": [
    "The auth_query.program_id field is required.",
    "The auth_query.app_id field is required."
  ]
}
Validation Error (403 Forbidden)
{
  "status": "error",
  "message": "An error has occurred. You can access more detailed information using the details area.",
  "meta": {
    "timestamp": "2025-05-04 21:02:51",
    "request_id": "1969d1bdff1-25a5",
    "code": 1
  },
  "details": [
    "..."
  ]
}
- Register:
Register (Sign up)
POST
Endpoint: https://api.paythor.com/auth/register
Content-Type: application/json
This endpoint allows new users to register for an account and create a merchant profile in a single request.

Request Parameters
Parameter	Type	Required	Description
user.firstname	string	Yes	User's first name
user.lastname	string	Yes	User's last name
user.email	string	Yes	User's email address
user.phone	string	Yes	User's phone number
user.password	string	Yes	User's password (must meet security requirements)
merchant.program_id	integer	Yes	ID of the program to register under
merchant.name	string	Yes	Merchant store name
merchant.company	string	Yes	Legal company name
merchant.email	string	Yes	Business contact email
merchant.phone	string	Yes	Business contact phone
merchant.web	string	No	Business website URL
merchant.country	string	Yes	Country code (ISO 3166-1 alpha-2)
You can access your "Bearer token" information by logging in through the login service after registration.

Example Request
How to call this endpoint in different languages

PHP
JavaScript
Python
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "user": {
    "firstname": "John",
    "lastname": "Doe",
    "phone": "905551234567",
    "email": "john.doe@example.com",
    "password": "Str0ng!P@ss"
  },
  "merchant": {
    "program_id": 1,
    "name": "Example Store",
    "company": "Example Company Ltd.",
    "email": "contact@example.com",
    "phone": "905551234567",
    "web": "https://example.com",
    "country": "tr",
    "lang": "en_US"
  }
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.paythor.com/auth/register/", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
Response
Success Response (201 Created)
{
  "status": "success",
  "message": "Accounts created. The user can be login with provided credentials",
  "meta": {
    "timestamp": "2025-05-04 18:53:29",
    "request_id": "1969ca56dca-1372",
    "code": 1
  },
  "data": {
    "firstname": "John",
    "lastname": "Doe",
    "phone": 905551234567,
    "email": "john.doe@example.com",
    "user_level": "admin",
    "id": 31333
  },
  "details": []
}
Error Response (400 Bad Request)
{
  "status": "error",
  "message": "An error has occurred. You can access more detailed information using the details area.",
  "meta": {
    "timestamp": "2025-05-04 18:52:09",
    "request_id": "1969ca436c0-1a10",
    "code": 1
  },
  "details": [
    "The user.firstname field is required.",
    "The user.lastname field is required.",
    "The user.email field is required.",
    "The user.phone field is required.",
    "The user.password must contain at least one uppercase/lowercase letters, one number and one special char.",
    "The merchant.name field must be a string.",
    "The merchant.name field is required.",
    "The merchant.country field must be at least 2 characters.",
    "The merchant.company field must be a string.",
    "The merchant.company field is required.",
    "The merchant.phone field must be a string.",
    "The merchant.phone field is required.",
    "The merchant.email field must be a string.",
    "The merchant.email field is required.",
    "The merchant.web field must be a string.",
    "The merchant.web field must be at least 6 characters.",
    "The :merchant.web{} must be a valid URL.",
    "The merchant.lang field must be a string.",
    "The merchant.lang field must be at least 2 characters.",
    "The :merchant.lang{} must be one of tr_TR, en_US, en, tr."
  ]
}
Validation Error (422 Unprocessable Entity)
{
  "status": "error",
  "message": "An error has occurred. You can access more detailed information using the details area.",
  "meta": {
    "timestamp": "2025-05-04 18:52:09",
    "request_id": "1969ca436c0-1a10",
    "code": 1
  },
  "details": [
    "..."
  ]
}
- OTP Verification: 
OTP Verification
POST
Endpoint: https://api.paythor.com/otp/verify
Content-Type: application/json
This endpoint allows users to verify their OTP.

Request Parameters
Parameter	Type	Required	Description
target	string	Yes	Email address for OTP verification
otp	string	Yes	One-time password code
Example Request
How to call this endpoint in different languages

PHP
JavaScript
Python
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json"); 

const raw = JSON.stringify({
  "target": "john.doe@example.com",
  "otp": "123456"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.paythor.com/otp/verify", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
Response
Success Response (200 OK)
{
  "status": "success",
  "message": "OTP verified successfully.",
  "meta": {
    "timestamp": "2025-05-04 21:03:40",
    "request_id": "1969d1c9d84-154f",
    "code": 1
  }
}
Error Response (422 Unprocessable Entity)
{
  "status": "error",
  "message": "The OTP is invalid or expired",
  "meta": {
    "timestamp": "2025-05-04 21:26:16",
    "request_id": "1969d314e49-1d92",
    "code": 1
  }
}
- Payment Create: 
Payment Create
POST
Endpoint: https://api.paythor.com/payment/create
Content-Type: application/json
This endpoint allows users to create a payment.

Example Request
How to call this endpoint in different languages

PHP
JavaScript
Python
const myHeaders = new Headers(); 
myHeaders.append("Authorization", "••••••");
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "payment": {
    "amount": "100.00",
    "currency": "TRY",
    "buyer_fee": "0",
    "method": "creditcard",
    "merchant_reference": "ORDER-123"
  },
  "payer": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "5000000000",
    "address": {
      "line_1": "123 Main St",
      "city": "Istanbul",
      "state": "Istanbul",
      "postal_code": "07050",
      "country": "TR"
    },
    "ip": "127.0.0.1"
  },
  "order": {
    "cart": [
      {
        "id": "PRD-123",
        "name": "Product Name",
        "type": "product",
        "price": "50.00",
        "quantity": 2
      },
      {
        "id": "DSC-SUMMER2024",
        "name": "SUMMER2024 (10%)",
        "type": "discount",
        "price": "5.00",
        "quantity": 1
      },
      {
        "id": "SHIP-1234",
        "name": "Shipping",
        "type": "shipping",
        "price": "10.00",
        "quantity": 1
      },
      {
        "id": "TAX-TOTAL-5678",
        "name": "Tax",
        "type": "tax",
        "price": "9.00",
        "quantity": 1
      }
    ],
    "shipping": {
      "first_name": "John",
      "last_name": "Doe",
      "phone": "5000000000",
      "email": "john.doe@example.com",
      "address": {
        "line_1": "123 Main St",
        "city": "Istanbul",
        "state": "Istanbul",
        "postal_code": "07050",
        "country": "TR"
      }
    },
    "invoice": {
      "id": "cart_hash_123",
      "first_name": "John",
      "last_name": "Doe",
      "price": "100.00",
      "quantity": 1
    }
  }
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.paythor.com/payment/create", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
Response
Success Response (200 OK)
{
  "status": "success",
  "message": "Transaction created",
  "meta": {
    "timestamp": "2025-05-05 07:33:38",
    "request_id": "1969f5d5c52-22fa",
    "code": 1
  },
  "data": {
    "id": 1,
    "amount": "10.00",
    "currency": "TRY",
    "status": "active",
    "merchant_reference": "ORDER-123",
    "buyer_fee": "0.00",
    "gateway_fee": "0.00",
    "created_at": "2025-05-05T07:33:38.000000Z",
    "date_due": "2025-05-08 07:33:38",
    "payment_token": "afdndgfdhsafwerwqwe",
    "payment_link": "https://pay.paythor.com/payment/afdndgfdhsafwerwqwe"
  }
}
Error Response (403 Forbidden)
{
  "status": "error",
  "message": "...",
  "meta": {
    "timestamp": "2025-05-04 21:26:16",
    "request_id": "1969d314e49-1d92",
    "code": 1
  },
  "details": []
}
Error Response (401 Unauthorized)
{
  "status": "error",
  "message": "...",
  "meta": {
    "timestamp": "2025-05-04 21:26:16",
    "request_id": "1969d314e49-1d92",
    "code": 1
  }
}
Error Response (422 Unprocessable Entity)
{
  "status": "error",
  "message": "...",
  "meta": {
    "timestamp": "2025-05-04 21:26:16",
    "request_id": "1969d314e49-1d92",
    "code": 1
  },
  "details": []
}