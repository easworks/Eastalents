import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
@Component({
  standalone: true,
  selector: 'landing-page',
  templateUrl: './landing.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
      LottiePlayerDirective,
      ImportsModule
  ]
})
export class LandingPageComponent {
    protected readonly customerLogos = [
        'client-1.png',
        'client-2.png',
        'client-3.png',
        'client-4.png',
        'client-5.png',
        'client-1.png',
  ].map(v => `/assets/img/${v}`);
  

  protected readonly testimonials = [
    {
      UserImage: '/assets/img/profile2/John-CEO.png',
      title: 'John',
      position: 'CEO of a Manufacturing Company',
      department: 'ERP- SAP S/4HANA Deployment',
      content: `“We chose EASWORKS for our ERP - SAP S/4HANA project. Their SAP S/4HANA development expertise exceeded our expectations, streamlining our business processes and optimizing our ERP system. The project was delivered on time and
      within budget, leaving us thoroughly impressed with their capabilities”.`
    },
    {
      UserImage: '/assets/img/profile2/David -Eng Manager.png',
      title: 'David',
      position: 'Engineering Manager at an Automotive Company',
      department: 'PLM-Teamcenter Implementation',
      content: `“ Choosing EASWORKS for our Teamcenter project was a game-changer. Their full-managed team seamlessly integrated with us, providing end-to-end support in implementing and optimizing Teamcenter. The collaboration was smooth,
      and with their dedicated assistance, we successfully achieved our PLM goals ”.`
    },
    {
      UserImage: '/assets/img/profile2/expense121_young_male_female_average_looking_latina_techie_with_c0b1c1ea-5c2f-4835-80ca-427ec2150067 (1).png',
      title: 'Sarah',
      position: 'Sales Director at a Technology Company',
      department: 'CRM - Salesforce Customization',
      content: `“ We relied on EASWORKS for Salesforce customization, and their highly skilled expert made a significant impact. They understood our specific requirements and delivered a tailored solution that greatly enhanced our CRM system.
      Thanks to their expertise, our sales and customer management processes have greatly improved ”.`
    },
    {
      UserImage: '/assets/img/profile2/expense121_headshot_of_male_european_young_female_techie_wearin_8a4ebed7-69e5-4907-9062-43e298d05434.png',
      title: 'Lisa',
      position: 'CFO of a Retail Company',
      department: 'BI Tool - Tableau',
      content: `“ EASWORKS guided us in selecting and implementing Tableau, a powerful BI tool. With Tableau's intuitive features and EASWORKS' expert guidance, we gained valuable insights and made data-driven decisions, resulting in significant
      improvements in our business operations ”.`
    },
  ];

}
