import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPaperPlane, faSuitcase, faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'new-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class DashboardComponent {

  @HostBinding()
  private readonly class = 'page @container';

  protected readonly icons = {
    faSuitcase, faPaperPlane, faUser, faEnvelope
  } as const;

  protected readonly metrics: {
    icon: IconDefinition,
    label: string;
    value: string | number;
  }[] = [
      {
        icon: faSuitcase,
        label: 'Scheduled Interview',
        value: mockMetrics.scheduledInterviews
      },
      {
        icon: faPaperPlane,
        label: 'Sent Applications',
        value: mockMetrics.applicationCount
      },
      {
        icon: faUser,
        label: 'Viewed by Others',
        value: mockMetrics.profileViewCount
      },
      {
        icon: faEnvelope,
        label: 'Unread Messages',
        value: mockMetrics.unreadMessages
      }
    ];

    protected readonly techGroup: {
      label: string;
      value: string | number;
      circumference: string|number;
      color:string;
    }[] = [
        {
          label: 'React',
          value: mockTechGroup.firstTech,
          circumference: mockTechGroup.firstTech*3.6,
          color:"text-pink-500"
        },
        {
          label: 'C#',
          value: mockTechGroup.secondTech,
          circumference: mockTechGroup.secondTech*3.6,
          color:"text-blue-500"
        },
        {
          label: 'Angular',
          value: mockTechGroup.secondTech,
          circumference: mockTechGroup.secondTech*3.6,
          color:"text-yellow-500"
        }
        
      ];

      protected readonly reqFunnel: {
        leftLabel: string;
        rightLabel: string;
        value: string | number;
        days: string ;
        color:string; 
        colorRight:string; 
        colorRightFade:string;
        colorText:string;
      }[] = [
          {
            leftLabel: 'Number of Applications',
            rightLabel:'Review Applications',
            value: mockReqFunnel.numOfApplication,
            days: "5,9",
            color:"bg-blue-800",
            colorRight:"bg-blue-500",
            colorRightFade:"bg-blue-300",
            colorText:"text-blue-700"
          },
          {
            leftLabel: 'Interviews',
            rightLabel:'Interview Candidates',
            value: mockReqFunnel.numOfInterview,
            days: "6,8",
            color:"bg-orange-400",
            colorRight:"bg-orange-500",
            colorRightFade:"bg-orange-300",
            colorText:"text-orange-700"
          },
          {
            leftLabel: 'Assessments',
            rightLabel:'Assessment',
            value: mockReqFunnel.numOfApplication,
            days: "7,4",
            color:"bg-yellow-400",
            colorRight:"bg-yellow-500",
            colorRightFade:"bg-yellow-300",
            colorText:"text-yellow-700"
          },
          {
            leftLabel: 'Hires',
            rightLabel:'Hires',
            value: mockReqFunnel.numOfHires,
            days: "3,5",
            color:"bg-green-400",
            colorRight:"bg-green-500",
            colorRightFade:"bg-green-300",
            colorText:"text-green-700"
          }
          
        ];


}

interface ProfileMetrics {
  scheduledInterviews: number;
  applicationCount: number;
  profileViewCount: number;
  unreadMessages: number;
}

interface TechGroup {
  firstTech: number;
  secondTech: number;
  thirdTech: number;
}

interface ReqirementFunnel {
  numOfApplication:number;
  numOfInterview: number;
  numOfAssesment: number;
  numOfHires: number;
}

const mockMetrics: ProfileMetrics = {
  scheduledInterviews: 76,
  applicationCount: 65,
  profileViewCount: 35673,
  unreadMessages: 83
};

const mockTechGroup: TechGroup = {
  firstTech: 65,
  secondTech: 31,
  thirdTech: 2 
};

const mockReqFunnel: ReqirementFunnel = {
  numOfApplication:1501,
  numOfInterview: 131,
  numOfAssesment: 71,
  numOfHires: 21
}
