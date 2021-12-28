import { QuizConfig } from './quiz-config';
import { Question } from './question';

export class Quiz {
    id: number = 0;
    name: string = "";
    description: string = "";
    config: QuizConfig = new QuizConfig(null);
    questions: Question[] = [];

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.name = data.question;
            this.description = data.description;
            this.config = new QuizConfig(data.config);
            this.questions = [];
            data.questions.forEach((q: any) => {
                this.questions.push(new Question(q));
            });
        }
    }
}
