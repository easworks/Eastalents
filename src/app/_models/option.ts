export class Option {
    id: number;
    // questionId: number;
    name: string;
    answer: boolean;
    attempt: boolean;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        // this.questionId = data.questionId;
        this.name = data.option;
        this.answer = data.answer;
        this.attempt = data.attempt;
    }
}
