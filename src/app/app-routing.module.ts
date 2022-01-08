import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AeRolesComponent } from './ae-roles/ae-roles.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EmploerJobpostingEditComponent } from './emploer-jobposting-edit/emploer-jobposting-edit.component';
import { EmploerJobpostingViewComponent } from './emploer-jobposting-view/emploer-jobposting-view.component';
import { EmploerQuestionComponent } from './emploer-question/emploer-question.component';
import { EmploerSignUpComponent } from './emploer-sign-up/emploer-sign-up.component';
import { FooterComponent } from './footer/footer.component';
import { GetHiredComponent } from './get-hired/get-hired.component';
import { HeaderComponent } from './header/header.component';
import { HowComponent } from './how/how.component';
import { IndexComponent } from './index/index.component';
import { InnovationComponent } from './innovation/innovation.component';
import { InterviewListComponent } from './interview-list/interview-list.component';
import { ProfileComponent } from './profile/profile.component';
import { QuantitativeAppComponent } from './quantitative-app/quantitative-app.component';
import { QuesCongratulationComponent } from './ques-congratulation/ques-congratulation.component';
import { QuestionSectionComponent } from './question-section/question-section.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ScoreAnalysisComponent } from './score-analysis/score-analysis.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TalentProfileEditComponent } from './talent-profile-edit/talent-profile-edit.component';
import { TalentProfileViewComponent } from './talent-profile-view/talent-profile-view.component';
import { TalentQuestionComponent } from './talent-question/talent-question.component';
import { TalentQuizQuestionComponent } from './talent-quiz-question/talent-quiz-question.component';
import { TalentComponent } from './talent/talent.component';
import { VerificationComponent } from './verification/verification.component';
import { WhyEastalentComponent } from './why-easworks/why-easworks.component';
import { WorkSkillsComponent } from './work-skills/work-skills.component';
import { YourJobsComponent } from './your-jobs/your-jobs.component';

const routes: Routes = [
  {
    path: 'index',
    component: IndexComponent,
  },
  {
    path: 'verification/:token',
    component: VerificationComponent,
  },
  {
    path: 'verification',
    component: VerificationComponent,
  },
  {
    path: 'setnewpassword/:token',
    component: SetNewPasswordComponent,
  },
  {
    path: 'setnewpassword',
    component: SetNewPasswordComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'AEroles',
    component: AeRolesComponent,
  },
  {
    path: 'EmployerJobpostingedit',
    component: EmploerJobpostingEditComponent,
  },
  {
    path: 'EmployerJobpostingview',
    component: EmploerJobpostingViewComponent,
  },
  {
    path: 'Employer-question',
    component: EmploerQuestionComponent,
  },
  {
    path: 'Employer-Signup',
    component: EmploerSignUpComponent,
  },
  {
    path: 'ApplicationConsultant',
    component: ApplicationListComponent,
  },
  {
    path: 'GetHired',
    component: GetHiredComponent,
  },
  {
    path: 'How',
    component: HowComponent,
  },
  {
    path: 'Innovation',
    component: InnovationComponent,
  },
  {
    path: 'Interview-List',
    component: InterviewListComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'signin',
    component: SignInComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'talent',
    component: TalentComponent,
  },
  {
    path: 'Talent-Profile-Edit',
    component: TalentProfileEditComponent,
  },
  {
    path: 'Talent-Profile-View',
    component: TalentProfileViewComponent,
  },
  {
    path: 'talentquestion',
    component: TalentQuestionComponent, // Get Started
  },
  {
    path: 'score-analysis',
    component: ScoreAnalysisComponent, // Get Started
  },
  {
    path: 'talentquizquestion',
    component: TalentQuizQuestionComponent, // Get Started
  },
  {
    path: 'WhyEasworks',
    component: WhyEastalentComponent,
  },
  {
    path: 'Work-Skills',
    component: WorkSkillsComponent,
  },
  {
    path: 'Your-Jobs',
    component: YourJobsComponent,
  },
  {
    path: 'question-section',
    component: QuestionSectionComponent,
  },
  {
    path: 'quantitative-app',
    component:QuantitativeAppComponent,
  },
  {
    path: 'ques-congratulation',
    component:QuesCongratulationComponent,
  },
  {
    path: '',
    component: IndexComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
