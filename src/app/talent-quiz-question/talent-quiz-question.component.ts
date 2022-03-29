import { Component, OnInit } from '@angular/core';
import { QuizService } from '../_services/quiz.service';
import { HelperService } from '../_helpers/helper.service';
import { Option } from '../_models/option';
import { Question } from '../_models/question';
import { Quiz } from '../_models/quiz';
import { QuizConfig } from '../_models/quiz-config';
import { HttpService } from '../_services/http.service';
import { ApiResponse } from '../_models';
import { ToasterService } from '../_services/toaster.service';
import { Router } from '@angular/router';
import { SessionService } from '../_services/session.service';

@Component({
  selector: 'app-talent-question',
  templateUrl: './talent-quiz-question.component.html',
  providers: [QuizService],
  styleUrls: []
})
export class TalentQuizQuestionComponent implements OnInit {

  questionResp: any;
  quizes: any[] = [];
  quiz: Quiz = new Quiz(null);
  mode = 'quiz';
  quizName: string = "";
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 2700,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date = new Date();
  endTime: Date = new Date();
  ellapsedTime = '00:00';
  duration = '';

  constructor(private quizService: QuizService,
    private router: Router,
    private toaster: ToasterService,
    private httpService: HttpService,
    private sessionService : SessionService) { }

  ngOnInit() {
    //this.quizes = this.quizService.getAll();
    //this.quizName = this.quizes[0].id;
    this.loadQuiz(this.quizName);
  }

  loadQuiz(quizName: string) {
    // this.quizService.get(quizName).subscribe(res => {
    //   this.quiz = new Quiz(res);
    //   this.pager.count = this.quiz.questions.length;
    //   this.startTime = new Date();
    //   this.ellapsedTime = '00:00';
    //   this.timer = setInterval(() => { this.tick(); }, 1000);
    //   this.duration = this.parseTime(this.config.duration);
    // });


    this.httpService.get('questions/getLatestQuestions').subscribe((response: ApiResponse<any>) => {
      if (response.status) {
        this.questionResp = response;
        console.log(this.questionResp);
        this.quiz = new Quiz(response);
        this.pager.count = this.quiz.questionData.length;
        this.startTime = new Date();
        this.ellapsedTime = '00:00';
        this.timer = setInterval(() => { this.tick(); }, 1000);
        this.duration = this.parseTime(this.config.duration);
      }
    }, (error) => {
      console.log(error);
    });

    this.mode = 'quiz';
  }

  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.config.duration) {
      this.onSubmit();
    }
    this.ellapsedTime = this.parseTime(diff);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questionData) ?
      this.quiz.questionData.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    // if (question.questionTypeId === 1) {
    //   question.optionsWithAnswers.forEach((x) => { if (x.id !== option.id) x.attempt = false; });
    // }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
  }

  isAnswered(question: Question) {
    return question.optionsWithAnswers.find(x => x.attempt) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.optionsWithAnswers.every(x => x.attempt === x.answer) ? 'correct' : 'wrong';
  };

  onSubmit() {
    // let answers = [];
    // this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered }));

    // Post your data to the server here. answers contains the questionId and the users' answer.
    // let data:{
    //   userId: this.sessionService.getLocalStorageCredentials()._id,

    // }
    console.log(this.quiz.questionData);
    this.httpService.post('questions/giveTest', this.quiz).subscribe((response: ApiResponse<any>) => {
      console.log(response);
      if (response.status) {
        this.toaster.success(`${response.message}`);
        setTimeout(() => {
          this.router.navigate(['/score-analysis']);
        }, 3000);
      }
    }, (error) => {
      console.log(error);
    });
  }
}
