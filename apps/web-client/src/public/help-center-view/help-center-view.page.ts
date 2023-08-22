import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

@Component({
  standalone: true,
  selector: 'help-center-view',
  templateUrl: './help-center-view.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
      LottiePlayerDirective,
      ImportsModule,
    MatTabsModule
  ]
})
export class HelpCenterViewPageComponent {

    protected readonly ClientsOverview = [
        {
            title: 'What is EASWORKS ?',
          content: [
            'EASWORKS is a platform that connects a network of expert enterprise software developers with top companies and startups. Our job is to ensure that we find the most suitable technical talent to give our clients’ projects the highest chance of success.'
          ]
        },
        {
            title: 'How does EASWORKS work?',
          content: [
            'Our team of experienced technical professionals will take time to learn about your EAS project and understand your hiring needs to guide you through the process of finding qualified, high-caliber candidates to integrate seamlessly into your team.'
          ]
        },
        {
            title: 'How is EASWORKS different from other platforms?',
          content: [
              'Fundamentally there are three major differences when compared to other platforms:',
              'EASWORKS is world’s first niche Enterprise Application Talent platform focusing on Enterprise Application which is heart & soul for any business function of an organization which is built by enterprise architects.',
              'We test and interview every EAS developer who applies to join our network. Our rigorous screening & vetting process allows ensuring every client gets to work with solid professionals who have strong work ethics and soft skills. and we curate & match you with best enterprise application talent at a time.',
              'Commitment to results -we always aim at candidates who is been hand selected as right match for you & who we believe suit your EAS project best and are available to start right away & the success of your projects is the only metric that really matters to us.'
          ]
        },
        {
            title: 'What type of projects can I hire EASWORKS for?',
          content: [
            'The EASWORKS network consists of enterprise domain & technical experts in enterprise software development , design and deployment who can hired for any simple to complex Enterprise Application software projects.'
          ]
        },
        {
            title: 'Does it cost anything to be matched with or interview candidates on EASWORKS?',
          content: [
            'No. There are no upfront fees on EASWORKS except the hourly rate you pay to work with the EAS developer after signing the contract to onboard the selected talent of your choice.'
          ]
        },
        {
            title: 'How long does the hiring process take at EASWORKS?',
          content: [
              `We typically move as quickly as you'd like. and Technical expert team is right on the job after you have initiated your requirement on our platform. There are some candidate specifications that take a bit longer to source than others, but on average, we'll have your first candidate matches ready for you to review within next 3-6 days.`,
              `From there, it's up to you how quickly you'd like to interview your candidates, although we recommend making your interview selection within three days. Waiting too long to make a selection will likely mean that the talent is no longer available or found another opportunity, and we'll need to re-source for you. Once you decide to hire a candidate, we can have them onboarded and ready to get started with you within 24 hours`,
              `We guarantee a perfect match within 3-6 days. Your matching experience will reflect one of the following three scenarios below:`,
              `We have someone in our professional enterprise application freelance talent network who is ready to work with you immediately.`,
              `A candidate is being vetted who matches your qualifications, and we will notify you of completion of the vetting process to take forward on the interview.`,
              `We currently do not have a match for your Enterprise Application job, so our team will be going through the recruiting process`
          ]
        },
        {
            title: 'Do you offer a trial period?',
          content: [
            'We offer a choice of two trial period options. You can either opt for a risk-free 20-hour trial where if you’re not satisfied, you pay nothing, or a 40-hour low-risk trial where if you’re not satisfied you pay 50% of the developer’s rate.'
          ]
        },
        {
            title: 'Is there a minimum contract duration?',
          content: [
            'Our minimum engagement is 150 hours or $ xxx USD (approximately one developer for 1 month). As they are lot of ground-up work and EASWORKS does the heavy lifting job of sourcing and vetting process , lesser hour below 150 hours is not viable business option for us.'
          ]
        },
        {
            title: 'Can I hire a full-time worker from EASWORKS and bring him/her into our company?',
          content: [
            'For the most part, yes. We will work with you to fully understand your specific requirements so that we can establish a mutually beneficial arrangement.'
          ]
        },
        {
            title: 'How does payment work -when, how much & for what will be charged?',
          content: [
              'EASWORKS engagement contract will detail the payment terms of the agreement, including rate where EASWORKS fees are already baked into the rates you see, number of hours, payment intervals and due dates.',
              'We will send invoices to your billing contact in accordance with upcoming payments, regardless of payment method. If you retain an ACH or credit card payment method with us, we will process payment on the date specified in the invoice (or after an approvals process, in some cases).',
              'Most importantly, You don’t pay a dime until you start working with a candidate you love.'
          ]
        },
    ]
}
