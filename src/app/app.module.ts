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
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
