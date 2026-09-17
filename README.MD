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

node -e "const fs = require('fs'); const content = \`## 🛠 Teknologi & Tools

- **Core Test Framework**: [Playwright Test](https://playwright.dev/) (\`@playwright/test\`)
- **Execution Environment & Engine**:
  - **Chromium**: Browser engine utama untuk pengujian antarmuka web
  - **Node.js**: Runtime environment JavaScript/TypeScript
- **Language & Compiler**:
  - **TypeScript**: Static typing untuk penulisan skrip pengujian yang kokoh
  - **Node File System (\`fs\`)**: Digunakan untuk menyimpan dan menyinkronkan data antar skrip secara lokal
- **Validation & Assertion**: Built-in Playwright assertions (\`expect\`, \`toBeVisible\`, \`toContain\`, \`toBeDefined\`)
- **Reporting Engine**: Playwright Built-in HTML Reporter & Terminal List Reporter
- **Code Editor**: Visual Studio Code
- **Version Control**: Git & GitHub

---

## ⚙️ Prasyarat Sistem

- **Node.js**: Versi \`18.x\` atau lebih baru
- **NPM**: Versi \`9.x\` atau lebih baru
- **Operating System**: Windows 10/11, macOS, atau Linux
- **Koneksi Internet**: Diperlukan untuk mengakses target pengujian API dan UI Script Labs

---

## 📦 Instalasi Proyek

1. Clone repository ini ke komputer lokal:
   \`\`\`bash
   git clone <URL_REPOSITORY_GITHUB_KAMU>
   cd automation-project-raka
   \`\`\`

2. Pasang semua dependensi project:
   \`\`\`bash
   npm install
   \`\`\`

3. Unduh browser binary yang dibutuhkan oleh Playwright:
   \`\`\`bash
   npx playwright install
   \`\`\`

---

## 🧪 Cara Menjalankan Pengujian

> ⚠️ **Catatan Penting**: Jalankan pengujian **API terlebih dahulu** agar file \`test-user.json\` terbuat dan terisi akun valid dari database sebelum menjalankan suite UI.

### Eksekusi Otomatis Lengkap

Menjalankan seluruh file pengujian (API dan UI) di terminal:
\`\`\`bash
npx playwright test
\`\`\`

### Eksekusi Spesifik API

Hanya menjalankan pengujian endpoint CRUD dan otentikasi API:
\`\`\`bash
npx playwright test tests/api
\`\`\`

### Eksekusi Spesifik UI

Hanya menjalankan pengujian otomasi antarmuka pengguna:
\`\`\`bash
npx playwright test tests/ui
\`\`\`

### Eksekusi Mode Headed (Browser Tampil)

Menjalankan pengujian UI dengan menampilkan jendela browser secara visual:
\`\`\`bash
npx playwright test tests/ui --headed
\`\`\`

### Eksekusi dengan UI Runner (Interactive Mode)

Membuka antarmuka interaktif bawaan Playwright untuk debugging langkah per langkah:
\`\`\`bash
npx playwright test --ui
\`\`\`

### Eksekusi Rekam Skrip UI Baru (Codegen)

Membuka generator selector otomatis bawaan Playwright:
\`\`\`bash
npx playwright codegen https://labs.hendri.me/
\`\`\`

---

## 📊 Laporan Pengujian (HTML Report)

Playwright secara otomatis menghasilkan dashboard laporan HTML komprehensif setelah pengujian selesai. Laporan mencakup:

- Status kelulusan setiap skenario (_Passed / Failed / Skipped_)
- Durasi waktu respon dari tiap pemanggilan API
- Assertion detail dan log payload data
- Cuplikan layar otomatis jika terjadi kegagalan pengujian

Untuk membuka laporan pengujian:
\`\`\`bash
npx playwright show-report
\`\`\`\n\`; fs.writeFileSync('PANDUAN_TOOLS.md', content); console.log('✅ File PANDUAN_TOOLS.md berhasil dibuat!');"
