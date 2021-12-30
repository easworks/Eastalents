import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { AeRolesComponent } from './ae-roles/ae-roles.component';
import { EmploerJobpostingEditComponent } from './emploer-jobposting-edit/emploer-jobposting-edit.component';
import { EmploerJobpostingViewComponent } from './emploer-jobposting-view/emploer-jobposting-view.component';
import { EmploerQuestionComponent } from './emploer-question/emploer-question.component';
import { EmploerSignUpComponent } from './emploer-sign-up/emploer-sign-up.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { GetHiredComponent } from './get-hired/get-hired.component';
import { HowComponent } from './how/how.component';
import { InnovationComponent } from './innovation/innovation.component';
import { InterviewListComponent } from './interview-list/interview-list.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { TalentComponent } from './talent/talent.component';
import { TalentProfileViewComponent } from './talent-profile-view/talent-profile-view.component';
import { TalentProfileEditComponent } from './talent-profile-edit/talent-profile-edit.component';
import { TalentQuestionComponent } from './talent-question/talent-question.component';
import { WhyEastalentComponent } from './why-easworks/why-easworks.component';
import { WorkSkillsComponent } from './work-skills/work-skills.component';
import { YourJobsComponent } from './your-jobs/your-jobs.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { VerificationComponent } from './verification/verification.component';
import { HttpAuthInterceptor } from './_helpers/http-auth.interceptor';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TalentQuizQuestionComponent } from './talent-quiz-question/talent-quiz-question.component';
import { TalentQuestionDynamicComponent } from './talent-question/talent-question-dynamic-step/talent-question-dynamic.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AeRolesComponent,
    EmploerJobpostingEditComponent,
    EmploerJobpostingViewComponent,
    EmploerQuestionComponent,
    EmploerSignUpComponent,
    ApplicationListComponent,
    GetHiredComponent,
    HowComponent,
    InnovationComponent,
    InterviewListComponent,
    ProfileComponent,
    ResetPasswordComponent,
    SignInComponent,
    SignUpComponent,
    TalentComponent,
    TalentProfileViewComponent,
    TalentProfileEditComponent,
    TalentQuestionComponent,
    WhyEastalentComponent,
    WorkSkillsComponent,
    YourJobsComponent,
    FooterComponent,
    HeaderComponent,
    VerificationComponent,
    SetNewPasswordComponent,
    ChangePasswordComponent,
    TalentQuizQuestionComponent,
    TalentQuestionDynamicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
