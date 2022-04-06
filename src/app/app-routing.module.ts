import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AeRolesComponent } from './ae-roles/ae-roles.component';
// import { ApplicationListComponent } from './application-list/application-list.component';
// import { ChangePasswordComponent } from './change-password/change-password.component';
// import { EmploerJobpostingEditComponent } from './emploer-jobposting-edit/emploer-jobposting-edit.component';
// import { EmploerJobpostingViewComponent } from './emploer-jobposting-view/emploer-jobposting-view.component';
// import { EmploerQuestionComponent } from './emploer-question/emploer-question.component';
// import { EmploerSignUpComponent } from './emploer-sign-up/emploer-sign-up.component';
// import { EmployerProfileComponent } from './employer-profile/employer-profile.component';
// import { FooterComponent } from './footer/footer.component';
// import { GetHiredComponent } from './get-hired/get-hired.component';
// import { HeaderComponent } from './header/header.component';
// import { HelpCenterDetailsComponent } from './help-center-details/help-center-details.component';
// import { HelpCenterViewComponent } from './help-center-view/help-center-view.component';
// import { HelpCenterComponent } from './help-center/help-center.component';
// import { HowComponent } from './how/how.component';
// import { IndexComponent } from './index/index.component';
// import { InterviewListComponent } from './interview-list/interview-list.component';
// import { ProfileComponent } from './profile/profile.component';
// import { QuantitativeAppComponent } from './quantitative-app/quantitative-app.component';
// import { QuesCongratulationComponent } from './ques-congratulation/ques-congratulation.component';
// import { QuestionSectionComponent } from './question-section/question-section.component';
// import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import { ScoreAnalysisComponent } from './score-analysis/score-analysis.component';
// import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
// import { SignInComponent } from './sign-in/sign-in.component';
// import { SignUpComponent } from './sign-up/sign-up.component';
// import { TalentProfileEditComponent } from './talent-profile-edit/talent-profile-edit.component';
// import { TalentProfileViewComponent } from './talent-profile-view/talent-profile-view.component';
// import { TalentQuestionComponent } from './talent-question/talent-question.component';
// import { TalentQuizQuestionComponent } from './talent-quiz-question/talent-quiz-question.component';
// import { TalentComponent } from './talent/talent.component';
// import { UseCaseComponent } from './use-case/use-case.component';
// import { VerificationComponent } from './verification/verification.component';
// import { VettedIndividualsComponent } from './vetted-individuals/vetted-individuals.component';
// import { WhyEastalentComponent } from './why-easworks/why-easworks.component';
// import { WorkSkillsComponent } from './work-skills/work-skills.component';
// import { YourJobsComponent } from './your-jobs/your-jobs.component';

const routes: Routes = [
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
  },
  {
    path: 'verification/:token',
    loadChildren: () => import('./verification/verification.module').then(m => m.VerificationModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./verification/verification.module').then(m => m.VerificationModule)
    ,
  },
  {
    path: 'setnewpassword/:token',
    loadChildren: () => import('./set-new-password/set-new-password.module').then(m => m.SetNewPasswordModule)
  },
  {
    path: 'setnewpassword',
    loadChildren: () => import('./set-new-password/set-new-password.module').then(m => m.SetNewPasswordModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule)
  },
  {
    path: 'AEroles',
    loadChildren: () => import('./ae-roles/ae-roles.module').then(m => m.AeRolesModule)
  },
  {
    path: 'EmployerJobpostingedit',
    loadChildren: () => import('./emploer-jobposting-edit/emploer-jobposting-edit.module').then(m => m.EmploerJobpostingEditModule)
  },
  {
    path: 'EmployerJobpostingview',
    loadChildren: () => import('./emploer-jobposting-view/emploer-jobposting-view.module').then(m => m.EmploerJobpostingViewModule)
  },
  {
    path: 'employerprofilequestion',
    loadChildren: () => import('./emploer-question/emploer-question.module').then(m => m.EmploerQuestionModule)
  },
  {
    path: 'Employer-Signup',
    loadChildren: () => import('./emploer-sign-up/emploer-sign-up.module').then(m => m.EmploerSignUpModule)
  },
  {
    path: 'ApplicationConsultant',
    loadChildren: () => import('./application-list/application-list.module').then(m => m.ApplicationListModule)
  },
  {
    path: 'GetHired',
    loadChildren: () => import('./get-hired/get-hired.module').then(m => m.GetHiredModule)
  },
  {
    path: 'How',
    loadChildren: () => import('./how/how.module').then(m => m.HowModule)
  },
  {
    path: 'useCase/:id',
    loadChildren: () => import('./use-case/use-case.module').then(m => m.UseCaseModule)
  },
  {
    path: 'Interview-List',
    loadChildren: () => import('./interview-list/interview-list.module').then(m => m.InterviewListModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule)
  },
  {
    path: 'talent',
    loadChildren: () => import('./talent/talent.module').then(m => m.TalentModule)
  },
  {
    path: 'Talent-Profile-Edit',
    loadChildren: () => import('./talent-profile-edit/talent-profile-edit.module').then(m => m.TalentProfileEditModule)
  },
  {
    path: 'Talentprofileview',
    loadChildren: () => import('./talent-profile-view/talent-profile-view.module').then(m => m.TalentProfileViewModule)
  },
  {
    path: 'talentprofilequestion',
    loadChildren: () => import('./talent-question/talent-question.module').then(m => m.TalentQuestionModule)
  },
  {
    path: 'score-analysis',
    loadChildren: () => import('./score-analysis/score-analysis.module').then(m => m.ScoreAnalysisModule)
  },
  {
    path: 'talentquizquestion',
    loadChildren: () => import('./talent-quiz-question/talent-quiz-question.module').then(m => m.TalentQuizQuestionModule)
  },
  {
    path: 'WhyEasworks',
    loadChildren: () => import('./why-easworks/why-easworks.module').then(m => m.WhyEasworksModule)
  },
  {
    path: 'Work-Skills',
    loadChildren: () => import('./work-skills/work-skills.module').then(m => m.WorkSkillsModule)
  },
  {
    path: 'Your-Jobs',
    loadChildren: () => import('./your-jobs/your-jobs.module').then(m => m.YourJobsModule)
  },
  {
    path: 'question-category',
    loadChildren: () => import('./question-section/question-section.module').then(m => m.QuestionSectionModule)
  },
  {
    path: 'quantitative-app',
    loadChildren: () => import('./quantitative-app/quantitative-app.module').then(m => m.QuantitativeAppModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./ques-congratulation/ques-congratulation.module').then(m => m.QuesCongratulationModule)
  },
  {
    path: 'eas-needs/:id',
    loadChildren: () => import('./vetted-individuals/vetted-individuals.module').then(m => m.VettedIndividualsModule)
  },
  {
    path: 'employer-profile',
    loadChildren: () => import('./employer-profile/employer-profile.module').then(m => m.EmployerProfileModule)
  },
  {
    path: 'help-center',
    loadChildren: () => import('./help-center/help-center.module').then(m => m.HelpCenterModule)
  },
  {
    path: 'help-center-view',
    loadChildren: () => import('./help-center-view/help-center-view.module').then(m => m.HelpCenterViewModule)
  },
  {
    path: 'help-center-details',
    loadChildren: () => import('./help-center-details/help-center-details.module').then(m => m.HelpCenterDetailsModule)
  },
  {
    path: '',
    loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
    ,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
