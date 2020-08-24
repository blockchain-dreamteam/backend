export default class Payment {

    private static readonly converter: Map<number | string, string> = new Map<number | string, string>([
        [0, 'Новый, оценка невозможна'],
        [1, 'Оплата без просрочек'],
        ['A', 'Просрочка от 1 до 29 дней'],
        [2, 'Просрочка от 30 до 59 дней'],
        [3, 'Просрочка от 60 до 89 дней'],
        [4, 'Просрочка от 90 до 119 дней'],
        [5, 'Просрочка более 120 дней'],
        [7, 'Регулярн.консолидир.платежи'],
        [8, 'Взыскание оплаты залогом'],
        [9, 'Безнадёжный долг/передано на взыскание'],
        ['-', 'Нет данных'],
    ]);

    /**
     * Своевременность платежей.
     * @private
     */
    private readonly type: string;

    public constructor(code: number | string) {
        if (!Payment.converter.has(code)) {
            throw new Error(`Неизвестный код платежа ${code}, определены: ${Payment.converter.keys().toString()}`);
        }
        this.type = Payment.converter.get(code);
    }
}
