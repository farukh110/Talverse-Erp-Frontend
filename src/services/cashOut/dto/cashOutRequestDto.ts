export interface CashOutRequestDto {

    transferPointId:Number;
    cashOutList: SubmitCashOutType[];
}


export interface SubmitCashOutType {
    currencyId: Number
    amount: Number
    currencyCode: string
    comments: string
    transferPointId: Number
}
