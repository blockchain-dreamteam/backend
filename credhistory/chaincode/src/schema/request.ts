import Borrower from './borrower';
import Creditor from './creditor';
import Entity from './entity';

/**
 * Запрос.
 */
export default class Request implements Entity {

    private static readonly DOCTYPE = 'request';

    // tslint:disable-next-line:variable-name
    private readonly docKey: string;
    private readonly docType: string;
    private readonly creditorRegNumber: string;
    private readonly borrowerMail: string;

    private readonly aim: string;
    private readonly targetValue: string;
    private readonly requested: string;

    constructor(creditorRegNumber: string,
                borrowerMail: string,
                aim: string,
                targetValue: string,
                requested: string) {
        this.docType = Request.DOCTYPE;
        this.docKey = Request.make_key(
            Creditor.make_key(creditorRegNumber),
            Borrower.make_key(borrowerMail),
            requested
        );
        this.creditorRegNumber = creditorRegNumber;
        this.borrowerMail = borrowerMail;
        this.aim = aim;
        this.targetValue = targetValue;
        this.requested = requested;
    }

    public key(): string {
        return this.docKey;
    }

    public as_bytes(): Uint8Array {
        return Buffer.from(JSON.stringify(this));
    }

    // tslint:disable-next-line:member-ordering
    public static make_key(creditorKey: string, borrowerKey: string, requested: string): string {
        return `${creditorKey}:${borrowerKey}:${this.DOCTYPE}:${requested}`;
    }
}
