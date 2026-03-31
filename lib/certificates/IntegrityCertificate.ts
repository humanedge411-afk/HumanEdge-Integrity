// IntegrityCertificate.ts

class IntegrityCertificate {
    private issuer: string;
    private recipient: string;
    private issuedDate: Date;
    private validUntil: Date;

    constructor(issuer: string, recipient: string, validDuration: number) {
        this.issuer = issuer;
        this.recipient = recipient;
        this.issuedDate = new Date();
        this.validUntil = new Date(this.issuedDate.getTime() + validDuration);
    }

    public getIssuer(): string {
        return this.issuer;
    }

    public getRecipient(): string {
        return this.recipient;
    }

    public getIssuedDate(): Date {
        return this.issuedDate;
    }

    public getValidUntil(): Date {
        return this.validUntil;
    }

    public isValid(currentDate: Date): boolean {
        return currentDate <= this.validUntil;
    }
}

export default IntegrityCertificate;