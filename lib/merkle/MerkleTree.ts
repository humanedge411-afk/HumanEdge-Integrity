// MerkleTree.ts

class MerkleNode {
    public left: MerkleNode | null;
    public right: MerkleNode | null;
    public hash: string;

    constructor(left: MerkleNode | null, right: MerkleNode | null, hash: string) {
        this.left = left;
        this.right = right;
        this.hash = hash;
    }
}

class MerkleTree {
    private root: MerkleNode | null;
    private leaves: string[];

    constructor(leaves: string[]) {
        this.leaves = leaves;
        this.root = this.buildTree();
    }

    private buildTree(): MerkleNode | null {
        if (this.leaves.length === 0) return null;

        let nodes = this.leaves.map(leaf => new MerkleNode(null, null, this.hashData(leaf)));

        while (nodes.length > 1) {
            const newNodes: MerkleNode[] = [];
            for (let i = 0; i < nodes.length; i += 2) {
                const left = nodes[i];
                const right = nodes[i + 1] || left; // If odd, duplicate last node
                newNodes.push(new MerkleNode(left, right, this.hashData(left.hash + right.hash)));
            }
            nodes = newNodes;
        }
        return nodes[0];
    }

    private hashData(data: string): string {
        // Simple hash function for demonstration (to be replaced with a proper hash function)
        return require('crypto').createHash('sha256').update(data).digest('hex');
    }

    public getRoot(): string | null {
        return this.root ? this.root.hash : null;
    }
}

// Example usage:
const leaves = ['data1', 'data2', 'data3', 'data4'];
const merkleTree = new MerkleTree(leaves);
console.log('Merkle Root:', merkleTree.getRoot());
