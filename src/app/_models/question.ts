import { Option } from './option';

export class Question {
    // id: number;
    question: string;
    // questionTypeId: number;
    optionsWithAnswers: Option[];
    // answered: boolean;
    product:string;
    productSpecific:string;
    questionMode:string;
    type:string;

    constructor(data: any) {
        data = data || {};
        // this.id = data.id;
        this.product = data.product;
        this.productSpecific = data.productSpecific;
        this.questionMode = data.questionMode;
        this.type = data.type;
        this.question = data.question;

        // this.questionTypeId = data.questionTypeId;
        // this.answered = data.answer;
        this.optionsWithAnswers = [];
        data.optionsWithAnswers.forEach((o: any) => {
            this.optionsWithAnswers.push(new Option(o));
        });
    }
}
