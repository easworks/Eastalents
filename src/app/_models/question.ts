import { Option } from './option';

export class Question {
    id: number;
    name: string;
    questionTypeId: number;
    options: Option[];
    answered: boolean;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.name = data.question;
        this.questionTypeId = data.questionTypeId;
        this.answered = data.answer;
        this.options = [];
        data.optionsWithAnswers.forEach((o: any) => {
            this.options.push(new Option(o));
        });
    }
}
