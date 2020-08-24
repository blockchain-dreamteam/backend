import Entity from './entity';

/**
 * Идентификация заемщика.
 */
export default class Borrower implements Entity {

    private static readonly DOCTYPE = 'borrower';

    /**
     * `${this.docType}:${passport}`
     * @private
     */
    // tslint:disable-next-line:variable-name
    private readonly _id: string;

    private readonly docType: string;

    /**
     * Имя.
     * @private
     */
    private readonly firstName: string;

    /**
     * Фамилия.
     * @private
     */
    private readonly lastName: string;

    /**
     * Отчество.
     * @private
     */
    private readonly patronymicName: string;

    /**
     * Дата рождения.
     * @private
     */
    private readonly dayOfBirth: string;

    /**
     * Место рождения.
     * @private
     */
    private readonly placeOfBirth: string;

    /**
     * Пол.
     * @private
     */
    private readonly sex: string;

    /**
     * Серия и номер паспорта.
     * @private
     */
    private readonly passport: string;

    /**
     * Гражданство.
     * @private
     */
    private readonly citizenship: string;

    public constructor(firstName: string,
                       lastName: string,
                       patronymicName: string,
                       dayOfBirth: string,
                       placeOfBirth: string,
                       sex: string,
                       passport: string,
                       citizenship: string) {
        [
            firstName, lastName, patronymicName,
            dayOfBirth, placeOfBirth, sex, passport,
            citizenship,
        ] = [
            firstName.trim(), lastName.trim(), patronymicName.trim(),
            dayOfBirth.trim(), placeOfBirth.trim(), sex.trim(),
            passport.trim(), citizenship.trim(),
        ];

        this.docType = Borrower.DOCTYPE;
        this._id = Borrower.make_key(passport);
        this.firstName = firstName;
        this.lastName = lastName;
        this.patronymicName = patronymicName;
        this.placeOfBirth = placeOfBirth;
        this.citizenship = citizenship;
        try {
            Date.parse(dayOfBirth);
            this.dayOfBirth = dayOfBirth;
        } catch (e) {
            throw new Error(`Дата рождения должна быть корректной датой, получена: ${dayOfBirth}`);
        }

        if (passport.length !== 10) {
            throw new Error(`Размер номера паспорта должен быть равен 10, получен: ${passport}`);
        }
        this.passport = passport;
        if (sex !== 'муж' && sex !== 'жен') {
            throw new Error(`Некорректно указан пол, ожидалось [\"муж\", \"жен\"], получено: ${sex}`);
        }
        this.sex = sex;
    }

    public key(): string {
        return this._id;
    }

    public as_bytes(): Uint8Array {
        return Buffer.from(JSON.stringify(this));
    }

    // tslint:disable-next-line:member-ordering
    public static make_key(passport: string): string {
        return `${this.DOCTYPE}:${passport}`;
    }
}
