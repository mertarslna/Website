# Paythor API Payment System Project

## Project Purpose
- Allows users to register and log in
- Provides secure authentication with OTP
- Can generate payment links and display their details
- A web application integrated with the Paythor API

## Main Features
- **Registration:** Register with user and merchant information
- **Login:** Login with email and password, then OTP verification
- **Session Management:** Manage session with token (localStorage)
- **Create Payment:** Generate a payment link with the entered amount
- **Payment Details:** View details of the generated payment link

## Technologies Used
- HTML, CSS, JavaScript
- Paythor REST API
- Session management with localStorage

## Flow
1. User registers.
2. Logs in and verifies with OTP code.
3. After successful login, redirected to the payment creation screen.
4. Enters an amount to generate a payment link.
5. Views payment details via the link.

## Security
- Passwords are checked with a strong password policy.
- Tokens are stored in localStorage.
- Additional verification with OTP.

## Demo
- Registration and login screens
- OTP verification
- Payment creation and detail display

## Conclusion
- Secure payment integration with Paythor API
- User-friendly and simple interface

---

**Thank you!**
