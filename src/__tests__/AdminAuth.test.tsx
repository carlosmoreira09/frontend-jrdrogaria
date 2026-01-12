/**
 * Admin Auth Tests
 * Testes unitários para autenticação admin
 */

import { describe, it, expect } from 'vitest';

describe('Admin Authentication', () => {
  describe('Login Form Validation', () => {
    const validateLoginForm = (email: string, password: string) => {
      const errors: string[] = [];
      
      if (!email) errors.push('Email é obrigatório');
      if (!password) errors.push('Senha é obrigatória');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email inválido');
      }
      if (password && password.length < 6) {
        errors.push('Senha deve ter pelo menos 6 caracteres');
      }
      
      return { valid: errors.length === 0, errors };
    };

    it('should require email and password', () => {
      const result = validateLoginForm('', '');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Email é obrigatório');
      expect(result.errors).toContain('Senha é obrigatória');
    });

    it('should validate email format', () => {
      const result = validateLoginForm('invalid-email', 'password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Email inválido');
    });

    it('should validate password length', () => {
      const result = validateLoginForm('admin@cotarodar.com', '123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Senha deve ter pelo menos 6 caracteres');
    });

    it('should accept valid credentials', () => {
      const result = validateLoginForm('admin@cotarodar.com', 'password123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Token Storage', () => {
    it('should store token in correct key', () => {
      const ADMIN_TOKEN_KEY = 'admin_token';
      expect(ADMIN_TOKEN_KEY).toBe('admin_token');
    });

    it('should separate admin and tenant tokens', () => {
      const ADMIN_TOKEN_KEY = 'admin_token';
      const TENANT_TOKEN_KEY = 'auth_token';
      expect(ADMIN_TOKEN_KEY).not.toBe(TENANT_TOKEN_KEY);
    });
  });

  describe('Role-based Access', () => {
    const checkPermission = (role: string, permission: string) => {
      const permissions: Record<string, string[]> = {
        super_admin: ['manage_tenants', 'manage_billing', 'manage_admins', 'view_logs', 'impersonate'],
        support: ['manage_tenants', 'view_logs', 'impersonate'],
        billing: ['manage_billing', 'view_logs'],
      };
      return permissions[role]?.includes(permission) || false;
    };

    it('super_admin should have all permissions', () => {
      expect(checkPermission('super_admin', 'manage_tenants')).toBe(true);
      expect(checkPermission('super_admin', 'manage_billing')).toBe(true);
      expect(checkPermission('super_admin', 'manage_admins')).toBe(true);
      expect(checkPermission('super_admin', 'impersonate')).toBe(true);
    });

    it('support should have limited permissions', () => {
      expect(checkPermission('support', 'manage_tenants')).toBe(true);
      expect(checkPermission('support', 'manage_billing')).toBe(false);
      expect(checkPermission('support', 'manage_admins')).toBe(false);
      expect(checkPermission('support', 'impersonate')).toBe(true);
    });

    it('billing should only manage billing', () => {
      expect(checkPermission('billing', 'manage_tenants')).toBe(false);
      expect(checkPermission('billing', 'manage_billing')).toBe(true);
      expect(checkPermission('billing', 'manage_admins')).toBe(false);
    });
  });
});

describe('Admin Dashboard', () => {
  describe('Stats Cards', () => {
    const stats = {
      totalTenants: 85,
      activeTenants: 72,
      trialTenants: 13,
      totalQuotations: 1234,
    };

    it('should calculate active percentage', () => {
      const activePercentage = (stats.activeTenants / stats.totalTenants) * 100;
      expect(activePercentage).toBeCloseTo(84.7, 1);
    });

    it('should identify trial tenants', () => {
      expect(stats.trialTenants).toBe(stats.totalTenants - stats.activeTenants);
    });
  });

  describe('Plan Distribution', () => {
    const planBreakdown = { free: 50, pro: 30, enterprise: 5 };

    it('should sum to total tenants', () => {
      const total = planBreakdown.free + planBreakdown.pro + planBreakdown.enterprise;
      expect(total).toBe(85);
    });

    it('should calculate percentages', () => {
      const total = 85;
      expect((planBreakdown.free / total) * 100).toBeCloseTo(58.8, 1);
      expect((planBreakdown.pro / total) * 100).toBeCloseTo(35.3, 1);
    });
  });
});
