# QA Automation Project - Script Labs (API & UI)

Repository ini berisi implementasi otomasi pengujian **End-to-End (E2E)** untuk **API Testing** dan **UI Testing** pada web demo **Script Labs** menggunakan **Playwright** dengan TypeScript.

Proyek ini mencakup pengujian API CRUD lengkap (Positive & Negative case), autentikasi dinamis berbasis JWT, serta otomatisasi UI untuk alur login hingga checkout keranjang belanja.

---

## 📋 Daftar Isi

- [Fitur & Skenario Pengujian](#-fitur--skenario-pengujian)
  - [1. API Testing (`/api/labs`)](#1-api-testing-apilabs)
  - [2. UI Testing (`https://labs.hendri.me/`)](#2-ui-testing-httpslabshendrime)
- [Struktur Direktori](#-struktur-direktori)
- [Teknologi & Tools](#-teknologi--tools)
- [Prasyarat Sistem](#-prasyarat-sistem)
- [Instalasi Proyek](#-instalasi-proyek)
- [Cara Menjalankan Pengujian](#-cara-menjalankan-pengujian)
  - [Eksekusi Otomatis Lengkap](#eksekusi-otomatis-lengkap)
  - [Eksekusi Spesifik API](#eksekusi-spesifik-api)
  - [Eksekusi Spesifik UI](#eksekusi-spesifik-ui)
  - [Eksekusi Mode Headed (Browser Tampil)](#eksekusi-mode-headed-browser-tampil)
- [Laporan Pengujian (HTML Report)](#-laporan-pengujian-html-report)

---

## 🚀 Fitur & Skenario Pengujian

### 1. API Testing (`/api/labs`)

Pengujian API menggunakan konsep `serial execution` dan pemanfaatan hook `beforeAll` untuk memastikan token JWT dibuat sekali secara dinamis dan digunakan kembali di seluruh request:

- **Setup Autentikasi (`beforeAll`)**:
  - Registrasi akun tester unik menggunakan timestamp (`/api/auth/register`).
  - Autentikasi login untuk mendapatkan token JWT (`/api/auth/login`).
  - Kredensial aktif disimpan otomatis ke dalam file `test-user.json`.
- **POST `/api/labs`**:
  - `[Positive]` Membuat entri lab baru (Status: `200` / `201`).
  - `[Negative]` Validasi error saat field `title` kosong (Status: `400` / `422`).
  - `[Negative]` Penolakan akses jika token otentikasi tidak disertakan (Status: `401`).
- **GET `/api/labs/{id}`**:
  - `[Positive]` Mengambil data lab spesifik berdasarkan ID valid (Status: `200`).
  - `[Negative]` Verifikasi respon ketika ID lab tidak ditemukan / invalid (Status: `404`).
- **PUT `/api/labs/{id}`**:
  - `[Positive]` Memperbarui title dan deskripsi record lab (Status: `200`).
  - `[Negative]` Validasi kegagalan update untuk ID yang tidak ada (Status: `404`).
- **DELETE `/api/labs/{id}`**:
  - `[Negative]` Penolakan penghapusan tanpa token otentikasi (Status: `401`).
  - `[Positive]` Menghapus record lab (Status: `200` / `204`) dan memverifikasi data benar-benar hilang (`404`).
  - `[Negative]` Penolakan penghapusan ulang untuk item yang sudah terhapus (Status: `404`).

### 2. UI Testing (`https://labs.hendri.me/`)

Pengujian antarmuka pengguna memvalidasi skenario esensial aplikasi:

- **Skenario 1 - Verifikasi Halaman Login**: Memastikan input Email Address, Password, serta tombol navigasi interaksi tampil di layar.
- **Skenario 2 - Login Gagal (Negative)**: Memastikan user tidak dapat login dan katalog tidak terbuka saat password salah.
- **Skenario 3 - Login Sukses (Positive)**: Membaca kredensial dinamis dari `test-user.json` dan memverifikasi redirect ke katalog produk.
- **Skenario 4 - CRUD Cart & Checkout Flow**:
  - Menambahkan produk ke cart (`add-selenium-login-pack`).
  - Mengubah kuantitas item di keranjang belanja.
  - Mengisi formulir data checkout (Nama, Email, Note).
  - Melakukan submit checkout dan memvalidasi pesan sukses (`checkout-success`).
  - Memverifikasi cart telah kosong kembali setelah transaksi selesai.

---

## 📁 Struktur Direktori

```text
automation-project/
├── .github/                     # Workflow CI/CD (opsional)
├── tests/
│   ├── api/
│   │   └── labs-crud.spec.ts    # Test suite API CRUD & Autentikasi
│   └── ui/
│       └── labs-ui.spec.ts      # Test suite UI Login, Cart, & Checkout
├── playwright.config.ts         # Konfigurasi global Playwright
├── test-user.json               # Data user dinamis dari hasil register API
├── package.json                 # Konfigurasi dependensi project
└── README.md                    # Dokumentasi proyek
```
