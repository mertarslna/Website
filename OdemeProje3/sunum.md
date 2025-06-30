# Paythor API ile Ödeme Sistemi Projesi

## Proje Amacı
- Kullanıcıların kayıt olup giriş yapabildiği
- OTP ile güvenli doğrulama sağlayan
- Ödeme linki oluşturup detaylarını gösterebilen
- Paythor API ile entegre çalışan bir web uygulaması geliştirmek

## Temel Özellikler
- **Kayıt:** Kullanıcı ve mağaza bilgileriyle kayıt olma
- **Giriş:** E-posta ve şifre ile giriş, ardından OTP doğrulama
- **Oturum Yönetimi:** Token ile oturumun yönetilmesi (localStorage)
- **Ödeme Oluşturma:** Kullanıcıdan alınan tutar ile ödeme linki oluşturma
- **Ödeme Detayı:** Oluşturulan ödeme linkinin detaylarını görüntüleme

## Kullanılan Teknolojiler
- HTML, CSS, JavaScript
- Paythor REST API
- localStorage ile oturum yönetimi

## Akış
1. Kullanıcı kayıt olur.
2. Giriş yapar, OTP kodu ile doğrulama yapar.
3. Başarılı giriş sonrası ödeme oluşturma ekranına yönlendirilir.
4. Tutar girerek ödeme linki oluşturur.
5. Link üzerinden ödeme detaylarını görüntüler.

## Güvenlik
- Şifreler güçlü parola politikası ile kontrol edilir.
- Tokenlar localStorage'da saklanır.
- OTP ile ek doğrulama sağlanır.

## Demo
- Kayıt ve giriş ekranları
- OTP doğrulama
- Ödeme oluşturma ve detay görüntüleme

## Sonuç
- Paythor API ile güvenli ödeme entegrasyonu
- Kullanıcı dostu ve basit arayüz

---

**Teşekkürler!**
**Teşekkürler!**
