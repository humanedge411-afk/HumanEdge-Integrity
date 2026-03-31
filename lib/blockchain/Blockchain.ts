/**
 * HumanEdge Blockchain Implementation
 * Distributed ledger with merkle trees, digital signatures, and audit trails
 */

import Block, { Transaction, AuditLogEntry } from './Block';
import HumanEdgeHash from '../crypto/HumanEdgeHash';

export interface BlockchainMetrics {
  totalBlocks: number;
  totalTransactions: number;
  totalAuditEntries: number;
  integrityScore: number;
  lastBlockHash: string;
  createdAt: number;
}

export class Blockchain {
  private chain: Block[] = [];
  private pendingTransactions: Transaction[] = [];
  private difficulty: number = 3;
  private minerReward: number = 100;
  private networkNodes: string[] = [];
  private privateKey: string;
  private publicKey: string;
  private createdAt: number;

  constructor(minerAddress: string, privateKey: string, publicKey: string) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.createdAt = Date.now();
    
    // Create genesis block
    const genesisBlock = new Block('GENESIS', '0x0', minerAddress, {
      type: 'genesis',
      network: 'HumanEdge-Integrity',
    });
    genesisBlock.mineBlock(this.difficulty);
    genesisBlock.sign(privateKey);
    this.chain.push(genesisBlock);
  }

  /**
   * Get the last block in chain
   */
  getLastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add transaction to pending transactions
   */
  addTransaction(transaction: Transaction): boolean {
    // Verify transaction hash
    const expectedHash = HumanEdgeHash.hash(
      transaction.from + transaction.to + transaction.data + transaction.amount + transaction.timestamp
    );
    
    if (transaction.hash !== expectedHash) {
      console.error('Invalid transaction hash');
      return false;
    }

    this.pendingTransactions.push(transaction);
    return true;
  }

  /**
   * Mine pending transactions into new block
   */
  minePendingTransactions(minerAddress: string): Block | null {
    if (this.pendingTransactions.length === 0) {
      console.log('No pending transactions to mine');
      return null;
    }

    const newBlock = new Block(
      `BLOCK-${this.chain.length}`,
      this.getLastBlock().dataHash,
      minerAddress,
      {
        mineTime: Date.now(),
        difficulty: this.difficulty,
        reward: this.minerReward,
      }
    );

    // Add transactions to block
    this.pendingTransactions.forEach(tx => {
      newBlock.addTransaction(tx);
    });

    // Mine the block
    newBlock.mineBlock(this.difficulty);
    newBlock.sign(this.privateKey);

    // Clear pending transactions
    this.pendingTransactions = [];

    // Add to chain
    this.chain.push(newBlock);

    return newBlock;
  }

  /**
   * Validate entire blockchain
   */
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify current block hash
      const expectedHash = currentBlock.dataHash;
      currentBlock.updateHash();
      if (currentBlock.dataHash !== expectedHash) {
        console.error(`Block ${i} has been modified`);
        return false;
      }

      // Verify chain continuity
      if (currentBlock.previousHash !== previousBlock.dataHash) {
        console.error(`Block ${i} has invalid previous hash`);
        return false;
      }

      // Verify digital signature
      if (!currentBlock.verifySignature(this.publicKey)) {
        console.error(`Block ${i} has invalid signature`);
        return false;
      }

      // Verify all transactions
      for (const tx of currentBlock.transactions) {
        const expectedTxHash = HumanEdgeHash.hash(
          tx.from + tx.to + tx.data + tx.amount + tx.timestamp
        );
        if (tx.hash !== expectedTxHash) {
          console.error(`Invalid transaction hash in block ${i}`);
          return false;
        }
      }

      // Verify merkle tree
      const expectedMerkleRoot = currentBlock.calculateMerkleRoot();
      if (currentBlock.merkleRoot !== expectedMerkleRoot) {
        console.error(`Block ${i} has invalid merkle root`);
        return false;
      }
    }

    return true;
  }

  /**
   * Get blockchain metrics
   */
  getMetrics(): BlockchainMetrics {
    let totalTransactions = 0;
    let totalAuditEntries = 0;

    for (const block of this.chain) {
      totalTransactions += block.transactions.length;
      totalAuditEntries += block.auditLog.length;
    }

    return {
      totalBlocks: this.chain.length,
      totalTransactions,
      totalAuditEntries,
      integrityScore: this.isChainValid() ? 100 : 0,
      lastBlockHash: this.getLastBlock().dataHash,
      createdAt: this.createdAt,
    };
  }

  /**
   * Get all blocks
   */
  getChain(): Block[] {
    return this.chain;
  }

  /**
   * Get block by index
   */
  getBlock(index: number): Block | null {
    return index >= 0 && index < this.chain.length ? this.chain[index] : null;
  }

  /**
   * Get block by ID
   */
  getBlockById(id: string): Block | null {
    return this.chain.find(block => block.id === id) || null;
  }

  /**
   * Add audit entry to current block
   */
  addAudit(blockIndex: number, action: string, actor: string, details: Record<string, any>): void {
    if (blockIndex >= 0 && blockIndex < this.chain.length) {
      this.chain[blockIndex].addAuditEntry(action, actor, details);
    }
  }

  /**
   * Get audit trail
   */
  getAuditTrail(): AuditLogEntry[] {
    const trail: AuditLogEntry[] = [];
    for (const block of this.chain) {
      trail.push(...block.auditLog);
    }
    return trail;
  }

  /**
   * Register network node
   */
  registerNode(nodeAddress: string): void {
    if (!this.networkNodes.includes(nodeAddress)) {
      this.networkNodes.push(nodeAddress);
    }
  }

  /**
   * Get network nodes
   */
  getNetworkNodes(): string[] {
    return this.networkNodes;
  }

  /**
   * Export blockchain
   */
  export(): string {
    return JSON.stringify({
      chain: this.chain.map(block => block.toJSON()),
      difficulty: this.difficulty,
      createdAt: this.createdAt,
      networkNodes: this.networkNodes,
    });
  }

  /**
   * Import blockchain
   */
  static import(data: string, privateKey: string, publicKey: string): Blockchain {
    const parsed = JSON.parse(data);
    const bc = new Blockchain('IMPORT', privateKey, publicKey);
    
    bc.chain = parsed.chain.map((blockData: any) => Block.fromJSON(blockData));
    bc.difficulty = parsed.difficulty;
    
    return bc;
  }
}

export default Blockchain;