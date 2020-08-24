
// tslint:disable-next-line:interface-name
export default interface Entity {
    key(): string;
    as_bytes(): Uint8Array;
}
