import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { MenuItem } from '@easworks/app-shell/state/menu';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FAQGroup, FAQListComponent } from '../common/faq-list.component';
import { SERVICE_TYPE_DATA } from '../service-type/data';
import { COMPANY_TYPE_DATA } from '../company-type/data';

@Component({
  standalone: true,
  selector: 'for-employers-page',
  templateUrl: './for-employers.page.html',
  styleUrls: ['./for-employers.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatExpansionModule,
    LottiePlayerDirective,
    FAQListComponent,
    RouterModule
  ]
})
export class ForEmployersPageComponent {
  protected readonly icons = {
    faAngleRight
  } as const;

  protected readonly accelerate = [
    {
      lottie: 'https://lottie.host/d1c2490c-af63-4ea7-a623-0b51dd9764ca/AO13AxjtHq.json',
      title: 'Vetted Individuals',
      content: `Fill Enterprise Application talent gaps in your next project by hiring a pre-vetted EAS professional, who brings a niche skillset and industry-specific knowledge.`
    },
    {
      lottie: 'https://lottie.host/1ff30c54-0496-4946-a30c-0d0690e85c81/MDWAKwRlZi.json',
      title: 'Full Teams',
      content: `With a fully-equipped EAS Team of professionals, you get the knowledge and support you need for Enterprise Software projects. We assemble your ideal team members, facilitate their on-boarding, and ensure everyone is off to a great start`
    },
    {
      lottie: 'https://lottie.host/b9233ad0-d539-4160-86c4-747d871ccac2/JlLPj9U19M.json',
      title: 'Enterprise Application Projects',
      content: `Partner with a distributed enterprise software team to handle a variety of projects including Configuration/Customization, Development , UI/UX design, analysis, project management, quality assurance, maintenance, and support`
    }
  ];

  protected readonly faqs: FAQGroup[] = [
    {
      name: 'Overview',
      items: [
        {
          question: 'What is EASWORKS?',
          content: [
            'EASWORKS serves as a specialized Enterprise Application Software (EAS)  platform that connects businesses, startups, and leading companies with a network of highly skilled enterprise software developers. ',
            'Our primary goal is to meticulously match our clients with the most suitable technical talent, leveraging their deep industry domain knowledge and expertise in enterprise applications. ',
            'This ensures that our clients projects have the highest probability of success and are delivered with exceptional quality.'
          ]
        },
        {
          question: 'How does EASWORKS work?',
          content: [
            'EASWORKS leverages the expertise of our experienced enterprise application technical professionals to provide seamless support. ',
            'We deeply understand your project and hiring requirements, guiding you in selecting highly skilled candidates who integrate seamlessly into your team. ',
            'Additionally, we offer fully managed tech services for comprehensive execution of enterprise application development projects.'
          ]
        },
        {
          question: 'How is EASWORKS different from other platforms?',
          content: [
            'EASWORKS stands out with:',
            '1.	Specialization: Our dedicated focus on the enterprise applications landscape enables us to provide specialized services that precisely cater to enterprise project Specialization: development requirements.',
            '2.	Understanding Complexity: We possess a deep understanding of the complexities involved in enterprise project development, including industry-specific challenges. This expertise allows us to navigate complexities and deliver tailored solutions.',
            '3.	Client-Centric Approach: We prioritize your needs and objectives, leveraging our extensive experience in the enterprise application space to customize our services. ',
            'Whether you require individual freelancers, a full team, or fully managed projects, we adapt to your preferences and provide tailored solutions.'
          ]
        },
        {
          question: 'What is the definition of EAS Talent as referred to companies by EASWORKS?',
          content: [
            'EAS Talent, short for Enterprise Application Software Talent, represents skilled professionals within the EASWORKS network who possess deep industry domain knowledge and technical expertise. ',
            'These experts specialize in various work categories related to enterprise application software and can be engaged on a part-time or full-time basis.',
            'They work closely with the Enterprise Success Manager (ESM) and the Customer to complete specific tasks and deliverables, utilizing their industry knowledge and technical skills. EAS Talent typically tracks their time on an hourly basis for each client and contract.'
          ]
        },
        {
          question: 'What types of projects can be undertaken by hiring EASWORKS?',
          content: [
            'EASWORKS offers a network of enterprise domain and technical experts in enterprise software development, design, deployment, data migration, support, and maintenance.',
            ' They can be hired for a wide range of projects, from simple to complex, involving Enterprise Application software. ',
            'These experts possess deep industry domain expertise, ensuring their suitability for various project requirements.'
          ]
        },
        {
          question: 'What is the role of an Enterprise Success Manager (ESM) with companies? ',
          content: [
            'The Enterprise Success Manager (ESM) is a key member of the EASWORKS team who serves as the primary point of contact for both customers and EAS Talent. ',
            'The ESM works closely with customers and talent to ensure that projects are successfully delivered and that the goals of both parties are achieved. ',
            'They play a crucial role in facilitating communication, resolving any issues or concerns, and ensuring overall satisfaction and success throughout the project engagement.'
          ]
        },
        {
          question: 'Is there a cost associated with being matched with or interviewing candidates on EASWORKS?',
          content: [
            'No, there are no upfront fees for being matched with or interviewing candidates on EASWORKS. ',
            'The only cost incurred is the hourly rate paid to work with the selected EAS developer after signing the contract and onboarding the chosen talent. ',
          ]
        },
        {
          question: 'What is the typical timeframe for the hiring process at EASWORKS?',
          content: [
            '•	The hiring process at EASWORKS is efficient and flexible:',
            '•	Our technical expert team promptly handles your requirements once initiated on our platform.',
            '•	Candidate matches are typically ready for your review within 5-6 days, with some specifications taking longer to source.',
            '•	We recommend selecting interview candidates within three days to ensure their availability. Delaying the selection may require us to re-source.',
            '•	Once you decide to hire a candidate, we can have them onboarded within 48 hours.',
            'We guarantee a perfect match within 3-6 days, with three possible scenarios: ',
            'o	Immediate availability of a candidate from our talent network,',
            'o	A candidate matching your qualifications undergoing vetting, ',
            'o	our team initiating the recruiting process if there is no immediate match.'
          ]
        },
        {
          question: 'Is there a fee to be matched with or interview candidates on EASWORKS?',
          content: [
            'No upfront fees. You only pay the hourly rate to work with the selected EAS developer after signing the contract and onboarding your chosen talent.'
          ]
        },
        {
          question: 'What engagement options does EASWORKS offer to meet clients enterprise application needs',
          content: [
            'EASWORKS Engagement Options:',
            '•	Staff Augmentation: Hire individual freelancers or a team of experts to augment your existing team.',
            '•	Full Team Outsourcing: Assemble a dedicated team of professionals to work on your project.',
            '•	Fully Managed Projects: Let EASWORKS handle the entire project lifecycle, from planning to deployment.',
            '•	Contract-to-Hire: Evaluate talent on a temporary basis before making a long-term commitment.',
            '•	Enterprise Application Consulting: Get expert guidance in assessing your needs and developing an implementation roadmap.',
            'EASWORKS provides a range of engagement options to meet your enterprise application requirements.',
          ]
        },
        {
          question: 'Is there a minimum contract duration?',
          content: [
            'To ensure the efficiency and viability of our sourcing and vetting process, we have set a minimum engagement requirement of 150 hours or $7,500 USD (equivalent to approximately one developer for one month).',
            'Projects below this threshold may not be suitable for the resources and efforts involved in our comprehensive process.'
          ]
        },
        {
          question: 'Is it possible to hire a full-time worker from EASWORKS and integrate them into our company?',
          content: [
            'In most cases, yes. We will collaborate closely with you to gain a comprehensive understanding of your specific needs and objectives. ',
            'This will enable us to establish a mutually beneficial arrangement that aligns with your requirements.'
          ]
        },
        {
          question: 'What are the payment terms and conditions on EASWORKS?',
          content: [
            'The payment terms and conditions on EASWORKS are clearly outlined in the engagement contract, which is tailored to the specific type of engagement, whether it is part-time, full-time, or a fully managed project. ',
            'The contract specifies important details, including the hourly rate with EASWORKS fees, the agreed-upon number of hours, payment intervals, and due dates. For fully managed tech services, payments may be milestone-based.',
            'Invoices will be sent to your designated billing contact according to the agreed payment schedule, regardless of the chosen payment method. If you have provided ACH or credit card information, payments will be processed on the specified date mentioned in the invoice, subject to any necessary approvals.',
            'It is important to note that you are not required to make any payment until you have commenced working with a candidate whom you are satisfied with. This provides you with peace of mind and allows you to evaluate the suitability of the engagement before making any financial commitment.'
          ]
        },
        {
          question: 'How does the Work Skill Assessment (WSA) performed on talents help clients in their project engagements?',
          content: [
            '•	Provides insights into talents interpersonal skills for project suitability assessment.',
            '•	Predicts talents response to new scenarios, aiding in project assignment decision-making.',
            '•	Evaluates cultural fit to ensure alignment with clients values and work environment.',
            '•	Enables informed talent selection decisions for optimal project outcomes.',
            '•	Enhances communication and collaboration between talents and clients.'
          ]
        }
      ]
    },
    {
      name: 'Getting Started With EASWORKS',
      items: [
        {
          question: 'How can I get started with EASWORKS as an employer?',
          content: [
            'To get started with EASWORKS as an employer, follow these three simple steps:',
            '1.	Step 1: Visit the EASWORKS website or platform. ',
            '2.	Step 2: Create an employer account by providing your company information and contact details. ',
            '3.	Step 3: Explore the available enterprise application services and solutions offered on the platform.',
            'By completing these steps, you can begin your journey with EASWORKS and gain access to a wide range of enterprise application services and solutions for your business needs.'
          ]
        },
        {
          question: 'How can I initiate a project with EASWORKS?',
          content: [
            '1.	Fill out the Start Hiring Questionnaire, providing all project requirements.',
            '2.	A Technical expert from EASWORKS will reach out to discuss your needs and ensure a clear understanding.',
            '3.	Engage in a conversation with our team to align on expectations and benefit from our expertise.',
            '4.	Finalize your Job Description on our platform to initiate the sourcing and vetting of potential candidates for your project.'
          ]
        },
        {
          question: 'How can I view candidates after registration?',
          content: [
            '•	To view candidates after registration, create a job post by filling out the Start Hiring Questionnaire.',
            '•	Skill-matched members will be alerted and invited to apply, and our technical team will personally reach out to top enterprise application talent who are fit.',
            '•	Candidate concurrence is obtained before sharing potential candidates with you.',
            '•	Provide all the necessary information in the questionnaire to expedite the process.',
            '•	Candidates typically become available for viewing and interviewing within 1-5 business days based on network availability and specific requirements.'
          ]
        },
        {
          question: 'How can I interact with candidates on EASWORKS?',
          content: [
            'Throughout the candidate selection and interview process on our platform, all communication is facilitated by EASWORKS. This means that contacting candidates through personal email or social media channels is not permitted.',
            'Once you have signed a contract with a selected candidate and work has commenced, you are free to communicate with them outside of the platform.'
          ]
        },
        {
          question: 'How soon can EASWORKS developers become part of my team?',
          content: [
            '1.	If a pre-vetted candidate is already available, the timeline for EASWORKS developers joining your team depends on the interview process and your preferred start date.',
            '2.	In situations where candidates are not immediately available, we initiate the recruitment process to identify the most suitable candidate for your project.',
            '3.	Rest assured that we will keep you well-informed and involved throughout the onboarding process, ensuring you are updated on the progress and timeline every step of the way.'
          ]
        },
        {
          question: 'If there is currently no available talent to meet the requirements of my work request, how long should I anticipate waiting for the right talent?',
          content: [
            'We recognize that finding the ideal enterprise application talent can be challenging due to the specialized nature of these skills. ',
            'However, with our extensive network within the enterprise community and our commitment to quality, we strive to match you with the perfect talent for your project. ',
            'While we understand your immediate needs, our focus is on ensuring the highest quality match. Typically, it takes approximately 8-14 days to find and present the right talent that aligns with your requirements.'
          ]
        }
      ]
    },
    {
      name: 'Testing & Screening',
      items: [
        {
          question: 'Do the developers at EASWORKS possess fluency in English?',
          content: [
            'Absolutely, we guarantee that every developer chosen for our clients is fluent in English. Prior to presenting them for hiring purposes, we conduct a thorough assessment of their technical skills as well as their communication abilities. ',
            'This ensures that our developers not only have the capability to comprehend verbal instructions but also actively participate in standup meetings.'
          ]
        },
        {
          question: 'How does your screening process work?',
          content: [
            'Our screening process is designed to carefully evaluate each applicant to ensure they meet our standards and align with your requirements. ',
            'We conduct a comprehensive evaluation that includes assessing their CV and portfolio, performing background and identity checks, conducting technical skills assessments, and assessing their work-related behavior preferences. ',
            'This rigorous screening process allows us to select the most qualified and suitable candidates for your enterprise application projects.'
          ]
        },
        {
          question: 'How does your EAS talent vetting process work?',
          content: [
            'Our talent vetting process is comprehensive and rigorous. We evaluate applicants based on their technical skills, professional skills, domain expertise, industry experience, and work skill assessment. ',
            'This thorough screening ensures that only top-quality talent is selected to join our platform.  ',
            'The vetting process typically takes around 2-4 weeks to complete, enabling us to guarantee the high standards and quality of our talent pool.'
          ]
        },
      ]
    },
    {
      name: 'Working With Global Talent',
      items: [
        {
          question: 'What are the various engagement models available for hiring EAS talent?',
          content: [
            'At EASWORKS, we understand that every project and organization is unique. We offer tailored engagement models to cater to your specific project needs, situation, and company goals. ',
            'Our aim is to ensure your success in enterprise application projects by leveraging our core expertise. We work closely with you to create a customized team augmentation strategy that aligns with your requirements and maximizes project outcomes.'
          ]
        },
        {
          question: 'What is the geographical distribution and time zone of EASWORKS developers?',
          content: [
            'EASWORKS boasts a global network of talented freelancers located across different geographies and time zones. ',
            'We commonly collaborate with top enterprise application software (EAS) developers from regions such as Latin America, Asia, Eastern Europe, and the United States. ',
            'This approach allows us to offer competitive rates while ensuring effective communication and collaboration between teams and clients within the same time zones.'
          ]
        },
        {
          question: 'Where do EASWORKS experts primarily work?',
          content: [
            'The majority of EASWORKS experts work remotely from their home, office, or co-working spaces.',
            'However, if there is a requirement for enterprise talents to work on your premises, we can coordinate and make necessary arrangements based on mutual agreement between all parties involved.'
          ]
        },
        {
          question: 'How can I track and monitor the progress of my EAS project?',
          content: [
            'For staff augmentation projects, EAS Talent will provide daily updates and status reports through EASWORKS online tools, which you will have access to. ',
            'For fully managed projects, weekly/monthly timesheet submissions and project status reports are utilized to keep you informed about the progress of the project.'
          ]
        },
        {
          question: 'How does EASWORKS facilitate and oversee project collaboration?',
          content: [
            'When you start working with EASWORKS, we will invite you to join our Slack workspace for project collaboration.',
            ' We set up two main channels for communication: "Project Mgt" and "GO LIVE" (Production).',
            '•	The "Project Mgt" channel includes you, your Enterprise Success Manager (ESM), and EASWORKS senior staff. This channel is used for any changes or questions regarding your current engagement.',
            '•	The "GO LIVE" channel includes everyone from the "Prj Mgt" channel, as well as your hired company and the scrum team if needed. This channel is used for regular project updates and discussions.',
            'Participating in these Slack channels is optional, and if you already have your own Slack workspace, you can use that instead.'
          ]
        },
        {
          question: 'Can I make changes to my current engagement with EASWORKS?',
          content: [
            'Absolutely! We understand that enterprise application project needs can evolve over time. You have the flexibility to make adjustments to your EASWORKS engagement. Here are some of the changes you can make:',
            '•	Increase or decrease the monthly hours allocated to your project.',
            '•	Transition between different engagement types based on your evolving requirements.',
            '•	Add additional freelancers to your EAS project as needed.',
            'To request any changes, simply reach out to your dedicated Enterprise Success Manager (ESM), and they will guide you through the process. Were here to ensure that your engagement with EASWORKS aligns with your changing needs.'
          ]
        },
        {
          question: 'Is it possible to have EASWORKS experts work on-site as needed?',
          content: [
            'While it is not a common occurrence, we understand that certain projects may require on-site presence. If this is the case, we are open to coordinating the relocation of our EAS Talent or a team to your location for a specific period of time.',
            'Our priority is to ensure that your project receives the necessary support and expertise to achieve success.',

          ]
        },
        {
          question: 'What if Im not satisfied with the EASWORKS services?',
          content: [
            'At EASWORKS, we prioritize customer satisfaction and take measures to address any concerns:',
            '•	Rigorous Screening: We carefully select top enterprise application talent through a thorough screening process.',
            '•	Trial Period: We offer a trial period for long-term projects to ensure a good fit with the assigned developer.',
            '•	Fair Resolution: If customers are unsatisfied with their Talent, our Enterprise Success Team seeks a fair resolution, including the possibility of replacing the EAS Talent at no additional cost.',
            'Our ultimate aim is to ensure that you have a positive and satisfactory experience throughout your engagement with EASWORKS.'
          ]
        },
        {
          question: 'What if my EAS Talent is unavailable during their scheduled workdays or times?',
          content: [
            'At EASWORKS, we prioritize dependability and understand the importance of meeting enterprise project goals. While we take steps to ensure availability and reliability of our talent, if an unforeseen circumstance arises where your Talent is unavailable, we will promptly match you with a new Talent and credit you for the time lost.',
            'Our aim is to ensure uninterrupted progress and seamless collaboration on your EAS project.'
          ]
        }
      ]
    },
    {
      name: 'Intellectual Property',
      items: [
        {
          question: 'Who holds the legal rights to the work produced by an EASWORKS talent? ',
          content: [
            'The client retains exclusive ownership of the work created by an EASWORKS talent. ',
            'EASWORKS focus is on connecting clients with exceptional Enterprise Application experts, and our contracts specify that all work produced by the expert is considered "work for hire" and belongs to the client, not EASWORKS or the expert.'
          ]
        },
        {
          question: 'How can I protect my intellectual property (IP) with EASWORKS? ',
          content: [
            'Safeguarding your intellectual property is a priority for us. EASWORKS is willing to establish a mutual non-disclosure agreement (NDA) to ensure confidentiality before delving into project specifics. ',
            'We have stringent confidentiality agreements with our contractors, and its important to note that IP is never owned by any freelancer who is hired either part time or full time.',
            'Additionally, if desired, you can opt to sign additional agreements such as a Master Services Agreement (MSA) with the developer for added protection.',

          ]
        },
        {
          question: 'How does EASWORKS ensure the protection of our intellectual property (IP)? ',
          content: [
            'EASWORKS prioritizes the protection of your intellectual property. Through our contract agreements, we secure exclusive ownership of the work created by the EASWORKS talent assigned to your project. ',
            'This ensures that you have full control and rights over intellectual property. Our client agreement follows the principle of "work for hire," granting you the necessary legal rights.',
            ' This approach has been successful in safeguarding our clients IP over the years and has provided them with peace of mind. If you have specific requirements regarding IP ownership, we are open to discussing and accommodating them to meet your needs.',

          ]
        }
      ]
    },
    {
      name: 'Pricing And Payments',
      items: [
        {
          question: 'What are the pricing details for hiring a developer through EASWORKS?',
          content: [
            'At EASWORKS, the cost of hiring a developer varies depending on several factors. While we work with remote developers located worldwide, our common talent pool comes from Latin America, South Asia, and Eastern Europe. This allows us to offer competitive rates while ensuring collaboration in overlapping time zones.',
            'The rates for developers typically range between $40-$110 USD per hour. However, its important to note that these rates can vary based on factors such as enterprise application skills, technologies, experience, and geographic location.',
            'When hiring through EASWORKS, there are no hidden or extra fees. You only pay for the hours worked by the candidates you select, as per the agreed terms and conditions outlined in the contract.'
          ]
        },
        {
          question: 'What is the payment process for EASWORKS services?',
          content: [
            'The payment process for EASWORKS services depends on the type of engagement you have with us. Here is an overview:',
            '1.	Billing Cycle: For most engagements, you will be billed at the end of each month for the work performed during that month. However, for milestone-based projects or projects with fixed monthly rates, the payment schedule may vary.',
            '2.	Hourly Tracking: To track the hours worked by freelancers on your project, you can log into your account and review the hours submitted. This allows you to monitor the progress and ensure transparency in the billing process.',
            '3.	Payment Due: Payment for the services provided is due upon receipt of the invoice. You will receive the invoice detailing the services rendered and the amount owed.',
            'Please note that specific payment terms and details will be outlined in your contract with EASWORKS. It is important to review the terms and follow the agreed-upon payment schedule to ensure a smooth payment process.'
          ]
        },
        {
          question: 'What payment methods are accepted by EASWORKS?',
          content: [
            'EASWORKS accepts ACH, wire transfers, and credit card payments as payment methods.',
            'Please note that specific instructions and details regarding payment methods will be provided to you during the invoicing process or in your contract with EASWORKS.'
          ]
        }
      ]
    }
  ];

  protected readonly serviceTypes = Object.entries(SERVICE_TYPE_DATA)
    .map(([key, value]) => {
      return {
        link: `/service-type/${key}`,
        name: value.herosection.title.highlight
      } as MenuItem;
    });

  protected readonly companyTypes = Object.entries(COMPANY_TYPE_DATA)
    .map(([key, value]) => {
      return {
        link: `/company-type/${key}`,
        name: value.name
      } as MenuItem;
    });

}