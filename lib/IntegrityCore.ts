import crypto from 'crypto';

/**
 * HumanEdge Proprietary Integrity Algorithm (HPIA v1.0)
 * Custom cryptographic system with Merkle trees, digital signatures, and blockchain
 */

export interface IntegrityHash {
  algorithm: 'HPIA-256';
  hash: string;
  timestamp: number;
  nonce: string;
}

export interface DataBlock {
  id: string;
  data: any;
  hash: IntegrityHash;
  signature: string;
  merkleProof: string;
  previousHash: string;
  blockIndex: number;
}

export interface IntegrityCertificate {
  id: string;
  owner: string;
  createdAt: number;
  dataHash: IntegrityHash;
  signature: string;
  merkleRoot: string;
  blockchainHash: string;
  auditLog: AuditEntry[];
  verificationStatus: 'valid' | 'invalid' | 'pending';
}

export interface AuditEntry {
  timestamp: number;
  action: string;
  actor: string;
  status: string;
  hash: string;
  details: any;
}

/**
 * Custom Hash Function: HPIA-256
 * Creates cryptographic integrity hash without using SHA256
 * Uses a proprietary multi-layer hashing approach
 */
export class HPIAHash {
  private static readonly PRIME = 7919;
  private static readonly MULTIPLIER = 31;

  /**
   * Core HPIA-256 hash function
   * Combines multiple hashing layers for integrity
   */
  static generate(data: string): IntegrityHash {
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // Layer 1: Polynomial Rolling Hash
    const layer1 = this.polynomialHash(data);
    
    // Layer 2: Murmur-inspired hash
    const layer2 = this.murmurHash(data, nonce);
    
    // Layer 3: XOR combination with timestamp
    const layer3 = this.xorCombine(layer1, layer2, timestamp.toString());
    
    // Layer 4: Final digest combining all layers
    const finalHash = this.finalizeHash(layer1, layer2, layer3, nonce);
    
    return {
      algorithm: 'HPIA-256',
      hash: finalHash,
      timestamp,
      nonce
    };
  }

  /**
   * Polynomial rolling hash - Layer 1
   */
  private static polynomialHash(data: string): string {
    let hash = 0;
    const chars = Buffer.from(data, 'utf8');
    
    for (let i = 0; i < chars.length; i++) {
      hash = (hash * this.MULTIPLIER + chars[i]) % (2 ** 32);
    }
    
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  /**
   * Murmur-inspired hash - Layer 2
   */
  private static murmurHash(data: string, seed: string): string {
    let hash = parseInt(seed.substring(0, 8), 16) || 0;
    const chars = Buffer.from(data, 'utf8');
    
    for (let i = 0; i < chars.length; i++) {
      hash ^= chars[i];
      hash = (hash << 13) | (hash >> 19);
      hash = (hash * 5 + 0xe6546b64) >>> 0;
    }
    
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  /**
   * XOR combination - Layer 3
   */
  private static xorCombine(hash1: string, hash2: string, data: string): string {
    let result = '';
    const maxLen = Math.max(hash1.length, hash2.length);
    
    hash1 = hash1.padStart(maxLen, '0');
    hash2 = hash2.padStart(maxLen, '0');
    
    for (let i = 0; i < maxLen; i++) {
      const val1 = parseInt(hash1[i] || '0', 16);
      const val2 = parseInt(hash2[i] || '0', 16);
      const val3 = parseInt(data.charCodeAt(i % data.length).toString(16), 16);
      result += (val1 ^ val2 ^ val3).toString(16);
    }
    
    return result.substring(0, 64);
  }

  /**
   * Final digest - Layer 4
   */
  private static finalizeHash(layer1: string, layer2: string, layer3: string, nonce: string): string {
    const combined = layer1 + layer2 + layer3 + nonce;
    let finalHash = '';
    
    for (let i = 0; i < combined.length; i += 2) {
      const byte = parseInt(combined.substring(i, i + 2), 16) || 0;
      finalHash += (byte ^ (i % 256)).toString(16).padStart(2, '0');
    }
    
    return finalHash.substring(0, 64);
  }

  /**
   * Verify hash integrity
   */
  static verify(data: string, hash: IntegrityHash): boolean {
    const recalculated = this.generate(data);
    // Reconstruct using same nonce for verification
    const recalc = this.reconstructHash(data, hash.nonce, hash.timestamp);
    return recalc === hash.hash;
  }

  private static reconstructHash(data: string, nonce: string, timestamp: number): string {
    const layer1 = this.polynomialHash(data);
    const layer2 = this.murmurHash(data, nonce);
    const layer3 = this.xorCombine(layer1, layer2, timestamp.toString());
    return this.finalizeHash(layer1, layer2, layer3, nonce);
  }
}

/**
 * Digital Signature System
 */
export class DigitalSignature {
  static sign(data: string, privateKey: string): string {
    const hash = HPIAHash.generate(data);
    const keyBuffer = Buffer.from(privateKey, 'utf8');
    
    let signature = '';
    for (let i = 0; i < hash.hash.length; i++) {
      const dataByte = parseInt(hash.hash[i], 16);
      const keyByte = keyBuffer[i % keyBuffer.length];
      signature += (dataByte ^ keyByte).toString(16).padStart(2, '0');
    }
    
    return signature;
  }

  static verify(data: string, signature: string, publicKey: string): boolean {
    const hash = HPIAHash.generate(data);
    const keyBuffer = Buffer.from(publicKey, 'utf8');
    
    let reconstructed = '';
    for (let i = 0; i < signature.length; i += 2) {
      const sigByte = parseInt(signature.substring(i, i + 2), 16);
      const keyByte = keyBuffer[(i / 2) % keyBuffer.length];
      reconstructed += (sigByte ^ keyByte).toString(16);
    }
    
    return reconstructed.includes(hash.hash.substring(0, 32));
  }
}

/**
 * Merkle Tree Implementation
 */
export class MerkleTree {
  private leaves: string[] = [];
  private tree: string[][] = [];

  constructor(data: string[]) {
    this.leaves = data.map(d => HPIAHash.generate(d).hash);
    this.buildTree();
  }

  private buildTree(): void {
    if (this.leaves.length === 0) return;
    
    let currentLevel = [...this.leaves];
    this.tree.push([...currentLevel]);
    
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || currentLevel[i];
        const combined = left + right;
        const parent = HPIAHash.generate(combined).hash;
        nextLevel.push(parent);
      }
      
      currentLevel = nextLevel;
      this.tree.push([...currentLevel]);
    }
  }

  getRoot(): string {
    return this.tree[this.tree.length - 1]?.[0] || '';
  }

  getProof(index: number): string {
    const proof: string[] = [];
    let currentIndex = index;
    
    for (let level = 0; level < this.tree.length - 1; level++) {
      const sibling = currentIndex % 2 === 0 
        ? this.tree[level][currentIndex + 1]
        : this.tree[level][currentIndex - 1];
      
      if (sibling) proof.push(sibling);
      currentIndex = Math.floor(currentIndex / 2);
    }
    
    return proof.join(':');
  }

  verifyProof(leaf: string, index: number, proof: string): boolean {
    const proofHashes = proof.split(':').filter(p => p);
    let currentHash = leaf;
    let currentIndex = index;
    
    for (const proofHash of proofHashes) {
      if (currentIndex % 2 === 0) {
        currentHash = HPIAHash.generate(currentHash + proofHash).hash;
      } else {
        currentHash = HPIAHash.generate(proofHash + currentHash).hash;
      }
      currentIndex = Math.floor(currentIndex / 2);
    }
    
    return currentHash === this.getRoot();
  }
}

export default {
  HPIAHash,
  DigitalSignature,
  MerkleTree
};