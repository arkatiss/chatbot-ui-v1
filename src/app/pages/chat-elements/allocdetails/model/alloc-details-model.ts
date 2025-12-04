export class AllocDtlsObject {
  allocDtlsObj: Array<AllocDetails>;
}

export class AllocDetails {
    ALLOCATED_QTY?: number;
    ALLOC_SPLIT?: any;
    BALANCE_QTY?: number;
    BILLING_TIME: string;
    BUYER_NAME: string;
    CUSTOMER_ID: string;
    DEPARTMENT_CODE: string;
    DIVISION_ID: number;
    INTRANSIT_QTY?: number;
    ITEM_CODE: string;
    ITEM_DESCRIPTION: string;
    ITEM_SIZE: number;
    OH_QTY?: number;
    ORDER_ID: number;
    ORDER_LINE_ID: number;
    ORDER_TYPE: string;
    ORGANIZATION_CODE: string;
    ORIG_ITEM?: any;
    RANKING: string;
    REDUCED_BOH: number;
    REDUCED_ITQ?: any;
    REQUESTED_QUANTITY: number;
    RES_QTY?: number;
    RE_INTRANSIT_QTY?: number;
    RE_OH_QTY?: number;
    RE_RES_QTY?: number;
    SOURCE_BOH: number;
    SSIC: string;
    STATUS: string;
    SUB_ITEM?: any;
    SUB_ITEM_FLAG: string;
    SURPLUS_ON_HAND_FLAG: string;
    FORCE_ALLOCATE: string;
    IDX: number;
    EST_ALLOTED_QTY?: any;
}
