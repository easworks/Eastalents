import { Option } from './option';

export class Question {
    id: number;
    name: string;
    questionTypeId: number;
    optionsWithAnswers: Option[];
    answered: boolean;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.name = data.question;
        this.questionTypeId = data.questionTypeId;
        this.answered = data.answer;
        this.optionsWithAnswers = [];
        data.optionsWithAnswers.forEach((o: any) => {
            this.optionsWithAnswers.push(new Option(o));
        });
    }
}
