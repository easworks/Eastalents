import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
@Component({
  standalone: true,
  selector: 'help-center-page',
  templateUrl: './help-center.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    ImportsModule
  ]
})
export class HelpCenterPageComponent {
  protected readonly icons = {
    faCircleArrowRight
  } as const;

  protected readonly HelpbyClient = [
    {
      title: 'Describe your needs',
      content: [
        'What is EASWORKS ?',
        'How does EASWORKS work?',
        'How is EASWORKS different from other platforms',
        'What type of projects can I hire EASWORKS for?'
      ]
    },
    {
      title: 'Getting Started with EASWORKS',
      content: [
        'How Can I View Candidates after Registration?',
        'How do I start a project?',
        'How can I communicate with candidates?',
        'How soon can EASWORKS developers join my team'
      ]
    },
    {
      title: 'Testing & Screening',
      content: [
        'Do EASWORKS developers speak English fluently?',
        'What’s your Screening process?',
        'What’s your vetting process?',
      ]
    },
    {
      title: 'Working with Global Talent',
      content: [
        'What are different engagement models to hire EA',
        'Where are EASWORKS developers located?',
        'Where do EASWORKS experts work?',
        'How can I monitor & track EAS project work?'
      ]
    },
    {
      title: 'Intellectual Property',
      content: [
        'Who owns the legal rights to the work created by',
        'How can I ensure that my IP is safe?',
        'How do we ensure that our IP is protected?',
      ]
    },
    {
      title: 'Pricing and Payments',
      content: [
        'What is the cost of hiring a developer through EASW',
        'How do you handle payments and invoices?',
        'What payment method does EASWORKS accept?',
      ]
    },
  ];



  protected readonly HelpbyFreelancer = [
    {
      title: 'Contractors Overview',
      content: [
        'What is EASWORK talent?',
        'How do I join EASWORKS as a contractor?',
        'How does EASWORKS helps Enterprise Applicatio',
        'If I complete my profile, how will EASWORKS use'
      ]
    },
    {
      title: 'Requirements',
      content: [
        'What are the prerequisites for working as a devel',
        'How does the vetting process work?',
        'Why do I have to go through a vetting process?',
      ]
    },
    {
      title: 'Selection & Shortlist process with EAS',
      content: [
        'How can I improve my chances of getting selecte',
        'What happens once I apply to a job based on invit',
        'How will I know if a client wants to interview me ',
        'Why was I declined or rejected for a job?'
      ]
    },
    {
      title: 'Candidature Finalization process with ',
      content: [
        'How can I improve my chances of getting selected ',
        'Is there a standard interview process with clients',
        'How soon after an interview will I hear back from a',
      ]
    },
    {
      title: 'Working as a EASWORKS Freelancer',
      content: [
        'I’m new to freelance work, how should I choose my',
        'What happens after a contract is signed with an EA',
        'Whats the process for logging my hours?',
        'How do I set up my EASWORKS profile?'
      ]
    },
    {
      title: 'Contractors Payments',
      content: [
        'Does EASWORKS take a cut from the hourly rate t',
        'How to expect payment and EASWORKS billing poli',
        'When can I expect to get paid?',
      ]
    },
    {
      title: 'Work skill Assessments (WSA)',
      content: [
        'What is a Work skill Assessment (WSA) ?',
        'Is Work skill Assessment (WSA) a test ?',
        'Why use Work skill Assessment (WSA) in workplac',
        'How does a Work skill Assessment (WSA) work?'
      ]
    },
  ];
}
