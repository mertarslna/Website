# Proje Promptu

Bu proje, Paythor API ile entegre çalışan bir ödeme ve kullanıcı yönetim panelidir. Temel özellikler:

- Kullanıcı kayıt, giriş ve OTP doğrulama işlemleri
- Şifremi unuttum ve şifre sıfırlama akışı
- Giriş yapan kullanıcılar için ödeme oluşturma paneli
- Sadece giriş yapan kullanıcıların erişebileceği kullanıcı listesi paneli (user list)
- Kullanıcı listesi, API'den çekilerek tablo halinde gösterilir
- Oturum kontrolü: Giriş yapılmadan ödeme paneline veya kullanıcı listesine erişilemez
- Arayüzde login, register, OTP, şifre sıfırlama, ödeme ve kullanıcı listesi panelleri arasında geçiş yapılabilir

Kullanılan teknolojiler:
- HTML, CSS, JavaScript (Vanilla)
- Paythor API (https://api.paythor.com)

Kullanıcı akışı:
1. Kullanıcı kayıt olur veya giriş yapar.
2. Giriş sonrası OTP doğrulaması yapılır.
3. Doğrulama sonrası ödeme paneli veya kullanıcı listesi paneli açılır.
4. Kullanıcı listesi panelinde, API'den gelen kullanıcılar tablo olarak görüntülenir.
5. Oturum kapatıldığında, tüm paneller gizlenir ve login ekranı gösterilir.

Kodda güvenlik ve erişim kontrolleri için localStorage'daki token kullanılır.
