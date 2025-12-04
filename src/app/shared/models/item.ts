import * as uuid from 'uuid';
export class Item {
    operation_type: any;
    category: any;
    uniqueId: any;
    attr_type: any;
    attr_name: any;
    attr_ref: any;
    oper_link: any;
    oper_output: any;
    oper_value: any;
    description: any;
    title: any;
    childs: Item[];
    parentIdx: any;
    index?: any;

    // input: string;
    // uId: string;
    // appID: string;
    
    // result: string;
   
    // // duration: string;
    // org: string;

    constructor(options: {
        // input: string,
        // appID: string,
        // result: string;
        // // duration: string;
        // org: string;
        operation_type: any;
        category: any;
        uniqueId: any;
        attr_type: any;
        attr_name: any;
        attr_ref: any;
        oper_link: any;
        oper_output: any;
        oper_value: any;
        description: any;
        childs?: Item[];
        title: any;
        parentIdx?: any;
        index?: any;
    }) {
        
        this.operation_type = options.operation_type;
        this.category = options.category;
        this.uniqueId = uuid.v4();
        this.attr_type = options.attr_type;
        this.attr_name = options.attr_name;
        this.attr_ref = options.attr_ref;
        this.oper_link = options.oper_link;
        this.oper_output = options.oper_output;
        this.oper_value = options.oper_value;
        this.description = options.description;
        this.childs = options.childs || [];
        this.title = options.title;
        this.parentIdx = options.parentIdx;
        this.index = options.index;

        // this.input = options.input;
        // this.uId = uuid.v4();
        // this.appID = options.appID;
        // this.description = options.description;
        // this.children = options.children || [];
        // this.result = options.result;
        // // this.duration = options.duration;
        // this.org = options.org;

    }
}