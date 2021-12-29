export class Option {
    id: number;
    questionId: number;
    name: string;
    isAnswer: boolean;
    attempt: boolean;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.questionId = data.questionId;
        this.name = data.option;
        this.isAnswer = data.answer;
        this.attempt = data.attempt;
    }
}
