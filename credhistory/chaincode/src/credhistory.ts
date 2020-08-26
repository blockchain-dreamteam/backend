import { Context, Contract } from 'fabric-contract-api';
import Account from './schema/account';
import Borrower from './schema/borrower';
import Creditor from './schema/creditor';
import Entity from './schema/entity';
import Payment from './schema/payment';
import Request from './schema/request';

export class CredHistory extends Contract {

    private static readonly STRING_CONSTANT = '1111';
    private static readonly putState = (ctx: Context) =>
        (entity: Entity) => ctx.stub.putState(entity.key(), entity.as_bytes())

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const putEntity = CredHistory.putState(ctx);
        const defaultEntities: Entity[] = [];

        const defaultCreditor: Creditor = new Creditor(
            'DefaultBank',
            CredHistory.STRING_CONSTANT,
            CredHistory.STRING_CONSTANT,
            CredHistory.STRING_CONSTANT,
        );
        defaultEntities.push(defaultCreditor);

        const now: Date = new Date();
        [
            'Носков Ярослав Филатович',
            'Беляков Исак Авдеевич',
            'Ильин Остап Робертович',
            'Соловьёв Николай Евсеевич',
        ].forEach((user, idx) => {
                const [lastName, firstName, patronymicName] = user.split(' ');
                const borrower: Borrower = new Borrower(
                    `default${idx}@default.ru`,
                    firstName,
                    lastName,
                    patronymicName,
                    `${Math.max(1, now.getDay() - idx)}-${Math.max(1, now.getMonth() - idx)}-${now.getFullYear() - idx * 20}`,
                    'Санкт-Петербург',
                    'муж',
                    '123456789' + Math.min(idx, 9),
                        'Российская Федерация',
                );
                const borrowerHasOpenedAccount: Entity = new Account(
                    defaultCreditor.getStateRegistrationNumber,
                    borrower.getEmail,
                    'Потребит.кредит',
                    'Личный',
                    '100000',
                    `${Math.max(1, now.getDay() - idx)}-${Math.max(1, now.getMonth() - idx)}-${now.getFullYear() - (idx === 0 ? 1 : idx - 1)}`,
                    'Активный',
                    [new Payment(0)],
                );
                const borrowerHasClosedAccount: Entity = new Account(
                    defaultCreditor.getStateRegistrationNumber,
                    borrower.getEmail,
                    'Потребит.кредит',
                    'Личный',
                    '100000',
                    `${Math.max(1, now.getDay() - idx)}-${Math.max(1, now.getMonth() - idx)}-${now.getFullYear() - idx * 3}`,
                    'Счет закрыт',
                    [
                        new Payment(
                            idx % 10 === 6 ? 'A' : idx % 10,
                        ),
                        new Payment(
                            (idx + 1) % 10 === 6 ? 'A' : (idx + 1) % 10,
                        ),
                        new Payment(
                            (idx + 2) % 10 === 6 ? 'A' : (idx + 2) % 10,
                        ),
                    ],
                );
                const borrowerHasRequest: Entity = new Request(
                    defaultCreditor.getStateRegistrationNumber,
                    borrower.getEmail,
                    'Потребительский кредит',
                    '10000',
                    `${Math.max(1, now.getDay() - idx)}-${Math.max(1, now.getMonth() - idx)}-${now.getFullYear()}`,
                );
                [
                    borrower,
                    borrowerHasOpenedAccount,
                    borrowerHasClosedAccount,
                    borrowerHasRequest,
                ].forEach((e) => defaultEntities.push(e));
        });

        for (const e of defaultEntities) {
            console.info('Added <--> ', e.key());
            await putEntity(e);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async createBorrower(ctx: Context,
                                email: string,
                                firstName: string,
                                lastName: string,
                                patronymicName: string,
                                dayOfBirth: string,
                                placeOfBirth: string,
                                sex: string,
                                passport: string,
                                citizenship: string) {
        console.info('============= START : Create Borrower ===========');
        const request: Borrower = new Borrower(
            email,
            firstName,
            lastName,
            patronymicName,
            dayOfBirth,
            placeOfBirth,
            sex,
            passport,
            citizenship,
        );

        const requestAsBytes = request.as_bytes();
        await ctx.stub.putState(request.key(), requestAsBytes);
        console.info('============= END : Create Borrower ===========');
        return requestAsBytes.toString();
    }

    public async createRequest(ctx: Context,
                               creditorRegNumber: string,
                               userMail: string,
                               aim: string,
                               targetValue: string): Promise<string> {
        console.info('============= START : Create Request ===========');
        const now: Date = new Date();
        const request: Request = new Request(
            creditorRegNumber,
            userMail,
            aim,
            targetValue,
            `${now.getDay()}-${now.getMonth()}-${now.getFullYear()}`,
        );

        const requestAsBytes = request.as_bytes();
        await ctx.stub.putState(request.key(), requestAsBytes);
        console.info('============= END : Create Request ===========');
        return requestAsBytes.toString();
    }

    public async queryAllBorrowers(ctx: Context): Promise<string> {
        const queryString: {selector: {docType: string}} = {selector: {docType: 'borrower'}};

        const result = await CredHistory.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        console.info(result);
        return result;
    }

    public async queryAllRequests(ctx: Context): Promise<string> {
        const queryString: {selector: {docType: string}} = {selector: {docType: 'request'}};

        const result = await CredHistory.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        console.info(result);
        return result;
    }

    public async queryAllAccounts(ctx: Context): Promise<string> {
        const queryString: {selector: {docType: string}} = {selector: {docType: 'account'}};

        const result = await CredHistory.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        console.info(result);
        return result;
    }

    // tslint:disable-next-line:member-ordering
    private static async getQueryResultForQueryString(ctx: Context, queryString: string) {

        const resultsIterator = await ctx.stub.getQueryResult(queryString);
        const results = await this.getAllResults(resultsIterator, false);

        return JSON.stringify(results);
    }

    // tslint:disable-next-line:member-ordering
    private static async getAllResults(iterator, isHistory) {
        const allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({Key, Record});
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }
}
