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

        const defaultCreditor: Entity = new Creditor(
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
                const borrower: Entity = new Borrower(
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
                    defaultCreditor.key(),
                    borrower.key(),
                    'Потребит.кредит',
                    'Личный',
                    '100000',
                    `${Math.max(1, now.getDay() - idx)}-${Math.max(1, now.getMonth() - idx)}-${now.getFullYear() - (idx === 0 ? 1 : idx - 1)}`,
                    'Активный',
                    [new Payment(0)],
                );
                const borrowerHasClosedAccount: Entity = new Account(
                    defaultCreditor.key(),
                    borrower.key(),
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
                    defaultCreditor.key(),
                    borrower.key(),
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

    public async queryBorrower(ctx: Context, passport: string): Promise<string> {
        const borrowerAsBytes = await ctx.stub.getState(Borrower.make_key(passport));
        if (!borrowerAsBytes || borrowerAsBytes.length === 0) {
            throw new Error(`Borrower with passport=${passport} does not exist`);
        }
        const result = borrowerAsBytes.toString();
        console.log(result);
        return result;
    }

    public async createRequest(ctx: Context,
                               creditorRegNumber: string,
                               passport: string,
                               aim: string,
                               targetValue: string,
                               requested: string) {
        console.info('============= START : Create Request ===========');

        const request: Request = new Request(
            Creditor.make_key(creditorRegNumber),
            Borrower.make_key(passport),
            aim,
            targetValue,
            requested,
        );

        await ctx.stub.putState(request.key(), request.as_bytes());
        console.info('============= END : Create Request ===========');
    }

    public async queryAllRequests(ctx: Context): Promise<string> {
        const queryString: {selector: {docType: string}} = {selector: {docType: 'request'}};

        const result = await CredHistory.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        console.info(result);
        return result;
    }

    // public async changeCarOwner(ctx: Context, carNumber: string, newOwner: string) {
    //     console.info('============= START : changeCarOwner ===========');
    //
    //     const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
    //     if (!carAsBytes || carAsBytes.length === 0) {
    //         throw new Error(`${carNumber} does not exist`);
    //     }
    //     const car: Data = JSON.parse(carAsBytes.toString());
    //     car.owner = newOwner;
    //
    //     await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
    //     console.info('============= END : changeCarOwner ===========');
    // }

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
