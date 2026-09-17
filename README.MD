# QA Automation Project - Script Labs (API & UI)

Repository ini berisi implementasi otomasi pengujian **End-to-End (E2E)** untuk **API Testing** dan **UI Testing** pada web demo **Script Labs** menggunakan **Playwright** dengan **TypeScript**.

Proyek ini mencakup pengujian API CRUD lengkap dengan positive & negative case, autentikasi dinamis berbasis JWT, serta otomatisasi UI untuk alur login hingga checkout keranjang belanja.

---

## 📋 Daftar Isi

- [🚀 Fitur & Skenario Pengujian](#-fitur--skenario-pengujian)
  - [1. API Testing (`/api/labs`)](#1-api-testing-apilabs)
    - [Setup Autentikasi (`beforeAll`)](#setup-autentikasi-beforeall)
    - [POST `/api/labs`](#post-apilabs)
    - [GET `/api/labs/{id}`](#get-apilabsid)
    - [PUT `/api/labs/{id}`](#put-apilabsid)
    - [DELETE `/api/labs/{id}`](#delete-apilabsid)

  - [2. UI Testing](#2-ui-testing)
    - [Skenario 1 - Verifikasi Halaman Login](#skenario-1---verifikasi-halaman-login)
    - [Skenario 2 - Login Gagal (Negative)](#skenario-2---login-gagal-negative)
    - [Skenario 3 - Login Sukses (Positive)](#skenario-3---login-sukses-positive)
    - [Skenario 4 - Cart & Checkout Flow](#skenario-4---cart--checkout-flow)

- [📁 Struktur Direktori](#-struktur-direktori)
- [🛠 Teknologi & Tools](#-teknologi--tools)
- [⚙️ Prasyarat Sistem](#-prasyarat-sistem)
- [📦 Instalasi Proyek](#-instalasi-proyek)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Install Browser Playwright](#3-install-browser-playwright)

- [🧪 Cara Menjalankan Pengujian](#-cara-menjalankan-pengujian)
  - [Eksekusi Otomatis Lengkap](#eksekusi-otomatis-lengkap)
  - [Eksekusi Spesifik API](#eksekusi-spesifik-api)
  - [Eksekusi Spesifik UI](#eksekusi-spesifik-ui)
  - [Eksekusi Mode Headed (Browser Tampil)](#eksekusi-mode-headed-browser-tampil)
  - [Eksekusi dengan UI Runner (Interactive Mode)](#eksekusi-dengan-ui-runner-interactive-mode)
  - [Eksekusi Rekam Skrip UI Baru (Codegen)](#eksekusi-rekam-skrip-ui-baru-codegen)

- [📊 Laporan Pengujian (HTML Report)](#-laporan-pengujian-html-report)
- [🔄 Recommended Test Flow](#-recommended-test-flow)
- [🧩 Troubleshooting](#-troubleshooting)
  - [`test-user.json`](#test-userjson-belum-tersedia)
  - [Browser Playwright](#browser-playwright-belum-tersedia)
  - [Ingin melihat proses UI test secara visual](#ingin-melihat-proses-ui-test-secara-visual)

- [👤 Author](#-author)

---

## 🚀 Fitur & Skenario Pengujian

### 1. API Testing (`/api/labs`)

Pengujian API menggunakan konsep **serial execution** dan hook `beforeAll` untuk memastikan token JWT dibuat sekali secara dinamis dan digunakan kembali di seluruh request.

#### Setup Autentikasi (`beforeAll`)

- Registrasi akun tester unik menggunakan timestamp melalui `/api/auth/register`.
- Login untuk mendapatkan token JWT melalui `/api/auth/login`.
- Kredensial aktif disimpan otomatis ke dalam file `test-user.json`.

#### POST `/api/labs`

**Positive Case**

- Membuat entri lab baru.
- Expected status: `200` / `201`.

**Negative Case**

- Validasi error ketika field `title` kosong.
- Expected status: `400` / `422`.
- Memastikan request ditolak ketika token autentikasi tidak disertakan.
- Expected status: `401`.

#### GET `/api/labs/{id}`

**Positive Case**

- Mengambil data lab spesifik berdasarkan ID yang valid.
- Expected status: `200`.

**Negative Case**

- Memverifikasi response ketika ID lab tidak ditemukan atau invalid.
- Expected status: `404`.

#### PUT `/api/labs/{id}`

**Positive Case**

- Memperbarui title dan deskripsi record lab.
- Expected status: `200`.

**Negative Case**

- Memvalidasi kegagalan update untuk ID yang tidak tersedia.
- Expected status: `404`.

#### DELETE `/api/labs/{id}`

**Negative Case**

- Memastikan penghapusan tanpa token autentikasi ditolak.
- Expected status: `401`.

**Positive Case**

- Menghapus record lab.
- Expected status: `200` / `204`.
- Memverifikasi bahwa data benar-benar sudah hilang dengan melakukan GET.
- Expected status GET setelah deletion: `404`.

**Negative Case**

- Memastikan penghapusan ulang terhadap item yang sudah dihapus ditolak.
- Expected status: `404`.

---

### 2. UI Testing

Target aplikasi:

https://labs.hendri.me/

Pengujian UI memvalidasi beberapa skenario utama aplikasi.

#### Skenario 1 - Verifikasi Halaman Login

Memastikan elemen berikut tersedia dan dapat diakses:

- Input **Email Address**
- Input **Password**
- Tombol login
- Elemen navigasi yang diperlukan

#### Skenario 2 - Login Gagal (Negative)

Memastikan user tidak dapat login menggunakan password yang salah dan katalog produk tidak terbuka.

#### Skenario 3 - Login Sukses (Positive)

- Membaca kredensial dinamis dari `test-user.json`.
- Melakukan proses login.
- Memverifikasi redirect menuju katalog produk.

#### Skenario 4 - Cart & Checkout Flow

Skenario ini menguji alur transaksi dari penambahan produk hingga checkout.

Flow yang diuji:

1. Menambahkan produk `add-selenium-login-pack` ke cart.
2. Membuka shopping cart.
3. Mengubah quantity item.
4. Mengisi form checkout:
   - Nama
   - Email
   - Note

5. Melakukan submit checkout.
6. Memvalidasi pesan sukses dengan identifier `checkout-success`.
7. Memverifikasi cart kembali kosong setelah transaksi selesai.

---

## 📁 Struktur Direktori

```text
automation-project/
│
├── .github/
│   └── workflows/              # Workflow CI/CD (opsional)
│
├── tests/
│   ├── api/
│   │   └── labs-crud.spec.ts   # Test suite API CRUD & autentikasi
│   │
│   └── ui/
│       └── labs-ui.spec.ts     # Test suite UI Login, Cart & Checkout
│
├── playwright.config.ts        # Konfigurasi global Playwright
├── test-user.json              # Data user dinamis hasil register API
├── package.json                # Konfigurasi dependency project
└── README.md                   # Dokumentasi project
```

---

## 🛠 Teknologi & Tools

| Teknologi / Tool             | Penggunaan                                  |
| ---------------------------- | ------------------------------------------- |
| **Playwright Test**          | Framework utama untuk API & UI testing      |
| **TypeScript**               | Bahasa pemrograman                          |
| **Node.js**                  | JavaScript runtime                          |
| **Chromium**                 | Browser engine untuk UI testing             |
| **Node File System (`fs`)**  | Membaca dan menyimpan data `test-user.json` |
| **Playwright Assertions**    | Validasi hasil pengujian                    |
| **Playwright HTML Reporter** | Reporting hasil test                        |
| **Terminal List Reporter**   | Menampilkan hasil test di terminal          |
| **Visual Studio Code**       | Code editor                                 |
| **Git & GitHub**             | Version control                             |

---

## ⚙️ Prasyarat Sistem

Pastikan environment sudah memenuhi persyaratan berikut:

- **Node.js:** versi `18.x` atau lebih baru
- **NPM:** versi `9.x` atau lebih baru
- **Operating System:**
  - Windows 10/11
  - macOS
  - Linux

- **Internet Connection:** diperlukan untuk mengakses API dan web Script Labs.

---

## 📦 Instalasi Proyek

### 1. Clone Repository

```bash
git clone <https://github.com/rakanugraha18/automation-project-raka>
cd automation-project-raka
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Browser Playwright

```bash
npx playwright install
```

Setelah proses instalasi selesai, project siap digunakan untuk menjalankan test.

---

## 🧪 Cara Menjalankan Pengujian

> ⚠️ **Catatan Penting:**
> Jalankan pengujian **API terlebih dahulu** agar file `test-user.json` dibuat dan berisi akun tester yang valid sebelum menjalankan UI test.

---

### Eksekusi Otomatis Lengkap

Menjalankan seluruh test suite API dan UI:

```bash
npx playwright test
```

---

### Eksekusi Spesifik API

Menjalankan hanya test API:

```bash
npx playwright test tests/api
```

Atau secara spesifik:

```bash
npx playwright test tests/api/labs-crud.spec.ts
```

---

### Eksekusi Spesifik UI

Menjalankan hanya test UI:

```bash
npx playwright test tests/ui
```

Atau secara spesifik:

```bash
npx playwright test tests/ui/labs-ui.spec.ts
```

---

### Eksekusi Mode Headed (Browser Tampil)

Menjalankan UI test dengan menampilkan browser secara visual:

```bash
npx playwright test tests/ui --headed
```

---

### Eksekusi dengan UI Runner (Interactive Mode)

Membuka interface interaktif bawaan Playwright untuk debugging:

```bash
npx playwright test --ui
```

---

### Eksekusi Rekam Skrip UI Baru (Codegen)

Membuka Playwright Codegen untuk membantu membuat selector dan test script:

```bash
npx playwright codegen https://labs.hendri.me/
```

---

## 📊 Laporan Pengujian (HTML Report)

Playwright menyediakan **HTML Reporter** untuk melihat hasil pengujian secara visual.

Laporan dapat digunakan untuk melihat:

- Status setiap test:
  - Passed
  - Failed
  - Skipped

- Durasi eksekusi test
- Detail assertion
- Error dan stack trace
- Test steps
- Screenshot atau attachment ketika tersedia

Untuk membuka HTML report:

```bash
npx playwright show-report
```

---

## 🔄 Recommended Test Flow

Untuk menjalankan project dari kondisi awal, gunakan urutan berikut:

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Jalankan API test
npx playwright test tests/api

# 4. Jalankan UI test
npx playwright test tests/ui

# 5. Jalankan seluruh test suite
npx playwright test

# 6. Buka HTML report
npx playwright show-report
```

---

## 🧩 Troubleshooting

### `test-user.json`

Pastikan API test dijalankan terlebih dahulu:

```bash
npx playwright test tests/api
```

File `test-user.json` akan dibuat atau diperbarui berdasarkan proses registrasi dan autentikasi API.

### Browser Playwright

Jalankan:

```bash
npx playwright install
```

### Ingin melihat proses UI test secara visual

Gunakan:

```bash
npx playwright test tests/ui --headed
```

Untuk debugging interaktif:

```bash
npx playwright test --ui
```

---

## 👤 Author

**Raka Nugraha**

QA Automation Project — Script Labs
