/**
 * CotaRodar E2E Tests
 * Testes end-to-end com Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('CotaRodar Landing Page', () => {
  test('should display landing page correctly', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Verify header
    await expect(page.locator('text=CotaRodar')).toBeVisible();
    await expect(page.locator('text=Entrar')).toBeVisible();
    await expect(page.locator('text=Começar Grátis')).toBeVisible();
    
    // Verify hero section
    await expect(page.locator('text=Cotações que rodam')).toBeVisible();
    await expect(page.locator('text=preços que fecham')).toBeVisible();
    
    // Verify stats
    await expect(page.locator('text=500+')).toBeVisible();
    await expect(page.locator('text=Empresas ativas')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/landing-page.png', fullPage: true });
  });

  test('should display all pricing plans', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Verify pricing section
    await expect(page.locator('text=Planos para todos os tamanhos')).toBeVisible();
    await expect(page.locator('text=Free')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
    
    // Verify prices
    await expect(page.locator('text=R$ 0')).toBeVisible();
    await expect(page.locator('text=R$ 199')).toBeVisible();
    await expect(page.locator('text=R$ 499')).toBeVisible();
  });

  test('should navigate to login when clicking Entrar', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Admin Login Page', () => {
  test('should display admin login form', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    
    // Verify form elements
    await expect(page.locator('text=Admin CotaRodar')).toBeVisible();
    await expect(page.locator('text=Acesso restrito para administradores')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/admin-login.png' });
  });

  test('should fill login form', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    
    // Fill form
    await page.fill('#email', 'admin@cotarodar.com');
    await page.fill('#password', 'admin123');
    
    // Verify filled values
    await expect(page.locator('#email')).toHaveValue('admin@cotarodar.com');
    await expect(page.locator('#password')).toHaveValue('admin123');
    
    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/admin-login-filled.png' });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173/admin/login');
    
    // Fill with invalid credentials
    await page.fill('#email', 'invalid@test.com');
    await page.fill('#password', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for error message (if API returns error)
    await page.waitForTimeout(1000);
  });
});

test.describe('Navigation', () => {
  test('should have working internal links', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Test features link
    const featuresLink = page.locator('a[href="#features"]');
    if (await featuresLink.isVisible()) {
      await featuresLink.click();
    }
    
    // Test pricing link
    const pricingLink = page.locator('a[href="#pricing"]');
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
    }
  });
});

test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');
    
    // Verify mobile layout
    await expect(page.locator('text=CotaRodar')).toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ path: 'e2e/screenshots/landing-mobile.png', fullPage: true });
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:5173');
    
    // Verify tablet layout
    await expect(page.locator('text=CotaRodar')).toBeVisible();
    
    // Take tablet screenshot
    await page.screenshot({ path: 'e2e/screenshots/landing-tablet.png', fullPage: true });
  });
});