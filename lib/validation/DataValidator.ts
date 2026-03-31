/**
 * Data Validation Framework
 * Comprehensive validation, checksum verification, and audit trail management
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  checksum: string;
  timestamp: number;
}

export interface DataMetadata {
  id: string;
  type: string;
  source: string;
  created: number;
  modified: number;
  owner: string;
  tags: string[];
}

export class DataValidator {
  private validationRules: Map<string, Function[]>;
  private auditTrail: Array<any>;

  constructor() {
    this.validationRules = new Map();
    this.auditTrail = [];
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    this.addRule('string', (value: any) => typeof value === 'string' || 'Must be a string');
    this.addRule('number', (value: any) => typeof value === 'number' || 'Must be a number');
    this.addRule('boolean', (value: any) => typeof value === 'boolean' || 'Must be a boolean');
    this.addRule('object', (value: any) => typeof value === 'object' && value !== null || 'Must be an object');
    this.addRule('array', (value: any) => Array.isArray(value) || 'Must be an array');
    this.addRule('email', (value: any) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email format');
    this.addRule('url', (value: any) => /^https?:\/\/.test(value) || 'Invalid URL format');
    this.addRule('uuid', (value: any) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value) || 'Invalid UUID format');
  }

  addRule(ruleType: string, validator: Function): void {
    if (!this.validationRules.has(ruleType)) {
      this.validationRules.set(ruleType, []);
    }
    this.validationRules.get(ruleType)!.push(validator);
  }

  validate(data: any, schema: Record<string, string>, metadata?: DataMetadata): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const [field, ruleType] of Object.entries(schema)) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
        continue;
      }

      const value = data[field];
      const rules = this.validationRules.get(ruleType) || [];

      for (const rule of rules) {
        const result = rule(value);
        if (result !== true) {
          errors.push(`Field '${field}': ${result}`);
        }
      }
    }

    for (const field of Object.keys(data)) {
      if (!(field in schema)) {
        warnings.push(`Unexpected field: ${field}`);
      }
    }

    const checksum = this.calculateChecksum(JSON.stringify(data));

    const auditEntry = {
      timestamp: Date.now(),
      action: 'validate',
      dataId: metadata?.id || 'unknown',
      isValid: errors.length === 0,
      errorCount: errors.length,
      warningCount: warnings.length,
    };
    this.auditTrail.push(auditEntry);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      checksum,
      timestamp: Date.now(),
    };
  }

  calculateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  verifyChecksum(data: string, expectedChecksum: string): boolean {
    return this.calculateChecksum(data) === expectedChecksum;
  }

  createIntegrityCertificate(dataId: string, dataHash: string, owner: string, metadata: Record<string, any>): string {
    const certificate = {
      id: this.generateCertificateId(),
      dataId,
      dataHash,
      owner,
      metadata,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
      signature: this.signCertificate(dataId + dataHash + owner),
    };

    const auditEntry = {
      timestamp: Date.now(),
      action: 'create_certificate',
      dataId,
      owner,
      certificateId: certificate.id,
    };
    this.auditTrail.push(auditEntry);

    return JSON.stringify(certificate);
  }

  verifyCertificate(certificate: string): boolean {
    try {
      const cert = JSON.parse(certificate);
      if (cert.expiresAt < Date.now()) {
        return false;
      }
      const expectedSignature = this.signCertificate(cert.dataId + cert.dataHash + cert.owner);
      return cert.signature === expectedSignature;
    } catch {
      return false;
    }
  }

  private signCertificate(data: string): string {
    return 'HEHA-SIG-' + this.calculateChecksum(data);
  }

  private generateCertificateId(): string {
    return 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  getAuditTrail(): Array<any> {
    return [...this.auditTrail];
  }

  clearAuditTrail(): void {
    this.auditTrail = [];
  }

  exportAuditTrail(): string {
    return JSON.stringify(this.auditTrail, null, 2);
  }

  validateDataset(dataset: Array<any>, schema: Record<string, string>, metadata?: DataMetadata): { results: ValidationResult[]; summary: any } {
    const results = dataset.map((item) => this.validate(item, schema, metadata));
    
    const summary = {
      totalItems: dataset.length,
      validItems: results.filter((r) => r.isValid).length,
      invalidItems: results.filter((r) => !r.isValid).length,
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
      totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
      validityPercentage: (results.filter((r) => r.isValid).length / dataset.length) * 100,
    };

    return { results, summary };
  }
}

export default DataValidator;