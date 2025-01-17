import Borrower from './borrower';
import Creditor from './creditor';
import Entity from './entity';
import Payment from './payment';

/**
 * Счет.
 */
export default class Account implements Entity {
    private static readonly DOCTYPE = 'account';

    // tslint:disable-next-line:variable-name
    private readonly docKey: string;
    private readonly docType: string;
    private readonly creditorRegNum: string;
    private readonly borrowerEmail: string;

    /**
     * Вид.
     * @private
     */
    private readonly type: string;

    /**
     * Отношение.
     * @private
     */
    private readonly relation: string;

    /**
     * Размер/Лимит.
     * @private
     */
    private readonly limit: string;

    /**
     * Открыт.
     * @private
     */
    private readonly opened: string;

    /**
     * Статус
     * @private
     */
    private readonly status: string;

    private readonly payments: Payment[];

    public constructor(creditorRegNum: string,
                       borrowerEmail: string,
                       type: string,
                       relation: string,
                       limit: string,
                       opened: string,
                       status: string,
                       payments: Payment[]) {
        this.docType = Account.DOCTYPE;
        this.docKey = Account.make_key(Creditor.make_key(creditorRegNum), Borrower.make_key(borrowerEmail), opened);
        this.creditorRegNum = creditorRegNum;
        this.borrowerEmail = borrowerEmail;
        this.type = type;
        this.relation = relation;
        this.limit = limit;
        this.opened = opened;
        this.status = status;
        this.payments = payments;
    }

    public key(): string {
        return this.docKey;
    }

    public as_bytes(): Uint8Array {
        return Buffer.from(JSON.stringify(this));
    }

    // tslint:disable-next-line:member-ordering
    public static make_key(creditorKey: string, borrowerKey: string, opened: string): string {
        return `${creditorKey}:${borrowerKey}:${this.DOCTYPE}:${opened}`;
    }
}
