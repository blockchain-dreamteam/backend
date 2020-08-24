import Entity from './entity';

/**
 * Кредитор.
 */
export default class Creditor implements Entity {

    private static readonly DOCTYPE: 'creditor';
    /**
     * `${this.docType}:${stateRegistrationNumber}`
     * @private
     */
    // tslint:disable-next-line:variable-name
    private docKey: string;

    private docType: string;

    /**
     * Полное название.
     */
    private fullName: string;

    /**
     * Государственный регистрационный номер.
     */
    private stateRegistrationNumber: string;

    /**
     * Идентификационный Номер Налогоплательщика.
     */
    private INN: string;

    /**
     * Общероссийский классификатор предприятий и организаций.
     */
    private OKPO: string;

    public constructor(fullName: string,
                       stateRegistrationNumber: string,
                       INN: string,
                       OKPO: string) {
        this.docType = Creditor.DOCTYPE;
        this.docKey = Creditor.make_key(stateRegistrationNumber);
        this.fullName = fullName;
        this.stateRegistrationNumber = stateRegistrationNumber;
        this.INN = INN;
        this.OKPO = OKPO;
    }

    public key(): string {
        return this.docKey;
    }

    public as_bytes(): Uint8Array {
        return Buffer.from(JSON.stringify(this));
    }

    // tslint:disable-next-line:member-ordering
    public static make_key(stateRegistrationNumber: string): string {
        return `${Creditor.DOCTYPE}:${stateRegistrationNumber}`;
    }
}
