import { test, expect } from "@playwright/test";
declare const require: any;
const testUser = require("../../test-user.json");

test.describe.serial("UI Automation Testing - Script Labs", () => {
  const baseURL = "https://labs.hendri.me/";

  // ==========================================
  // SKENARIO 1: Buka Halaman Login & Verifikasi Form
  // ==========================================
  test("1. Buka Halaman Login & Verifikasi Komponen", async ({ page }) => {
    await page.goto(baseURL);

    // Verifikasi input dan tombol login muncul di layar
    await expect(
      page.getByRole("textbox", { name: "Email Address" }),
    ).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In →" })).toBeVisible();
  });

  // ==========================================
  // SKENARIO 2: Login Gagal (Negative Scenario)
  // ==========================================
  test("2. Login Gagal - Password Salah", async ({ page }) => {
    await page.goto(baseURL);

    await page
      .getByRole("textbox", { name: "Email Address" })
      .fill(testUser.email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill("PasswordSalah123!");
    await page.getByRole("button", { name: "Sign In →" }).click();

    // Assertion: Memastikan tetap berada di halaman login / tombol login masih ada
    await expect(page.getByRole("button", { name: "Sign In →" })).toBeVisible();
    // Assertion: Memastikan katalog produk/cart belum muncul
    await expect(page.getByTestId("add-selenium-login-pack")).not.toBeVisible();
  });

  // ==========================================
  // SKENARIO 3: Login Sukses (Positive Scenario)
  // ==========================================
  test("3. Login Sukses - Menggunakan test-user.json", async ({ page }) => {
    await page.goto(baseURL);

    // Ambil data dinamis dari file JSON
    await page
      .getByRole("textbox", { name: "Email Address" })
      .fill(testUser.email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(testUser.password);
    await page.getByRole("button", { name: "Sign In →" }).click();

    // Assertion: Berhasil masuk ke katalog produk
    await expect(page.getByTestId("add-selenium-login-pack")).toBeVisible({
      timeout: 10000,
    });
  });

  // ==========================================
  // SKENARIO 4: CRUD Cart & Checkout Flow
  // ==========================================
  test("4. Flow Cart & Checkout - Add, Update Qty, Fill Form, Verify Order", async ({
    page,
  }) => {
    await page.goto(baseURL);

    // 1. Autentikasi Masuk
    await page
      .getByRole("textbox", { name: "Email Address" })
      .fill(testUser.email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(testUser.password);
    await page.getByRole("button", { name: "Sign In →" }).click();

    // 2. Add to Cart (Create Cart Record)
    const addProductBtn = page.getByTestId("add-selenium-login-pack");
    await expect(addProductBtn).toBeVisible({ timeout: 10000 });
    await addProductBtn.click();

    // 3. Update Cart Quantity
    const increaseBtn = page.getByRole("button", {
      name: "Increase Selenium Login Test",
    });
    await expect(increaseBtn).toBeVisible();
    await increaseBtn.click();

    // 4. Pengisian Form Checkout
    const nameInput = page.getByTestId("checkout-name");
    const emailInput = page.getByTestId("checkout-email");
    const companyInput = page.getByRole("textbox", {
      name: "Company / Portfolio Note",
    });
    const notesInput = page.getByRole("textbox", { name: "Notes" });
    const submitBtn = page.getByTestId("checkout-submit");

    await expect(nameInput).toBeVisible();
    await nameInput.fill("QA Automated Tester");
    await emailInput.fill(testUser.email);
    await companyInput.fill("Portfolio Testing");
    await notesInput.fill("Order generated automatically via Playwright");

    // Submit Checkout
    await submitBtn.click();

    // 5. Assertion: Verifikasi Checkout Berhasil
    const successCard = page.getByTestId("checkout-success");
    await expect(successCard).toBeVisible({ timeout: 10000 });

    // 6. Assertion: Verifikasi Cart Di-reset / Kosong Setelah Checkout Selesai
    await expect(page.getByText("Your cart is empty. Add a")).toBeVisible();
  });
});
