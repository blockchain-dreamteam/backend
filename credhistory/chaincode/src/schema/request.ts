import Entity from './entity';

/**
 * Запрос.
 */
export default class Request implements Entity {

    private static readonly DOCTYPE = 'request';

    // tslint:disable-next-line:variable-name
    private readonly _id: string;
    private readonly docType: string;
    private readonly creditorKey: string;
    private readonly borrowerKey: string;

    private readonly aim: string;
    private readonly targetValue: string;
    private readonly requested: string;

    constructor(creditorKey: string,
                borrowerKey: string,
                aim: string,
                targetValue: string,
                requested: string) {
        this.docType = Request.DOCTYPE;
        this._id = Request.make_key(creditorKey, borrowerKey, requested);
        this.creditorKey = creditorKey;
        this.borrowerKey = borrowerKey;
        this.aim = aim;
        this.targetValue = targetValue;
        this.requested = requested;
    }

    public key(): string {
        return this._id;
    }

    public as_bytes(): Uint8Array {
        return Buffer.from(JSON.stringify(this));
    }

    // tslint:disable-next-line:member-ordering
    public static make_key(creditorKey: string, borrowerKey: string, requested: string): string {
        return `${creditorKey}:${borrowerKey}:${this.DOCTYPE}:${requested}`;
    }
}
