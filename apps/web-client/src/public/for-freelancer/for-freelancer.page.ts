import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DomainsApi } from '@easworks/app-shell/api/domains.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { DomainState } from '@easworks/app-shell/state/domains';
import { fromPromise } from '@easworks/app-shell/utilities/to-promise';
import { FAQGroup, FAQListComponent } from '../common/faq-list.component';
import { SoftwareTilesContainerComponent } from '../common/software-tiles-container.component';

@Component({
  standalone: true,
  selector: 'for-freelancer-page',
  templateUrl: './for-freelancer.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    MatExpansionModule,
    FAQListComponent,
    SoftwareTilesContainerComponent
  ]
})
export class ForFreelancerPageComponent {
  private readonly api = {
    domains: inject(DomainsApi)
  } as const;
  private readonly domainState = inject(DomainState);

  protected readonly featuredDomains = this.initFeaturedDomains();
  protected readonly faqs: FAQGroup[] = [
    {
      name: 'Overview',
      items: [
        {
          question: 'What is EASWORKS and how does it benefit freelancers?',
          content: [
            'EASWORKS is a dedicated platform for Enterprise Application Software(EAS) developers, offering them the opportunity to become part of a niche EAS community.',
            'Freelancers who join EASWORKS gain access to exclusive opportunities to showcase their highly sought-after enterprise skills to top-tier companies. ',
            'Through EASWORKS, freelancers can connect with elite companies, allowing them to secure exciting enterprise application projects and expand their professional growth prospects.'
          ]
        },
        {
          question: 'What is the definition of EAS Talent as referred to freelancers by EASWORKS ?',
          content: [
            'EAS Talent, short for Enterprise Application Software Talent, represents skilled professionals within the EASWORKS network who possess deep industry domain knowledge and technical expertise.',
            'These experts specialize in various work categories related to enterprise application software and can be engaged on a part-time or full-time basis.',
            'They work closely with the Enterprise Success Manager (ESM) and the Customer to complete specific tasks and deliverables, utilizing their industry knowledge and technical skills. EAS Talent typically tracks their time on an hourly basis for each client and contract.'
          ]
        },
        {
          question: 'How can I become an EAS Talent with EASWORKS? ',
          content: [
            'To become an EAS Talent with EASWORKS, you can follow these steps:',
            '1.	Fill out the application at EASWORKS.com/join to apply.',
            '2.	Your application will be reviewed to assess your technical expertise and communication skills for working with top clients.',
            '3.	Based on the available opportunities, candidates are selected for each enterprise application project, considering their professional skills, experience, domain expertise, and availability.',
            '4.	If you are selected for a specific enterprise application role, you will receive a link to apply for that position.',
            '5.	You will then undergo an interview process with the client for the specific project.',
            '6.	Upon selection, you will be required to sign a mutually agreed contract between you, EASWORKS, and the client, following the "work for hire" principle.',
            '7.	Once onboarded, you will be integrated into the clients project and team, and you can start working on the assigned tasks.'
          ]
        },
        {
          question: 'How does EASWORKS support Enterprise Application Talent like you? ',
          content: [
            ' EASWORKS is a dedicated platform for Enterprise Application Tech Talent like you. Our primary goal is to connect you with highly sought-after Enterprise Application jobs from elite companies that match your skills and interests. ',
            'Additionally, we provide a dedicated community for enterprise application software, where you can stay informed about the latest technology trends specific to your industry.'
          ],
        },
        {
          question: 'How will EASWORKS utilize my completed profile? ',
          content: [
            'Your completed and approved profile is a prerequisite for being considered for upcoming enterprise application job opportunities. It is recommended to complete your profile in advance if you are actively seeking an EAS job opportunity.',
            'After completing your profile, our Enterprise Technical team will schedule a profile approval meeting to evaluate your professional enterprise application skills, interests, and aspirations.'
          ]
        },
        {
          question: 'How can I apply for a job opportunity in the enterprise application space?',
          content: [
            ' To apply for job opportunities in the enterprise application space, follow these steps:',
            '1.	Complete your profile and ensure it is approved on our dedicated enterprise application platform.',
            '2.	Set your status as "Actively looking for new jobs" to indicate your availability and interest.',
            '3.	Once your profile is active and marked as "Actively looking," we will actively promote your profile to clients and share relevant EAS job opportunities with you.',
            '4.	Your profile serves as a universal job application, saving you time and effort in the application process.',
            '5.	When we find an opportunity that aligns with your EAS skills and preferences, we will contact you to gauge your interest.',
            '6.	After expressing interest, the vetting process begins, which includes answering position-specific questions and completing work skill assessments to provide a comprehensive understanding of your capabilities.'
          ]
        },
        {
          question: 'What is the role of an Enterprise Success Manager (ESM) with EAS Talents? ',
          content: [
            'The Enterprise Success Manager (ESM) is a key member of the EASWORKS team who serves as the primary point of contact for both customers and EAS Talent.',
            'The ESM works closely with customers and talent to ensure that projects are successfully delivered and that the goals of both parties are achieved.',
            'They play a crucial role in facilitating communication, resolving any issues or concerns, and ensuring overall satisfaction and success throughout the project engagement.'
          ]
        },
        {
          question: 'What are the guidelines for contacting EASWORKS clients during different phases of engagement?',
          content: [
            'Guidelines for different engagement phases:',
            '•	Applying for a new job role:',
            'o	All communication with clients is handled by EASWORKS until youre selected for an interview.',
            '•	After an interview:',
            'o	As an EASWORKS talent, you agree not to contact clients outside of the platform until you begin working together.',
            'o	Avoid messaging them on any social platforms.',
            '•	While working on an engagement:',
            'o	Once a contract is in place, clients will decide how the work unfolds.',
            'o	You will be directly in touch with the client using project collaboration tools like SLACK, aligning with the project cadence.',
            '•	After an engagement:',
            'o	Clients sign a two-year non-solicitation agreement before working with you on the EASWORKS platform.',
            'o	If they want to work with you again after the initial engagement, they will reach out via EASWORKS.',
            'o	You can maintain a professional relationship with past EASWORKS clients, knowing they are committed to the two-year non-solicitation agreement.'
          ]
        }
      ]
    },
    {
      name: 'Requirements',
      items: [
        {
          question: 'What are the requirements for becoming an enterprise application developer through EASWORKS?',
          content: [
            'Prerequisites for working as an EASWORKS talent include:',
            '•	Possessing the necessary professional skills.',
            '•	Demonstrating strong spoken and written English skills.',
            '•	Having a stable internet connection.',
            '•	Willingness to align with clients working schedules.',
            '•	Commitment to delivering high-quality work.',
            '•	Maintaining a positive and professional attitude.',
            '•	Being a team player.',
            '•	Having a desire to continuously learn and improve oneself.'
          ]
        },
        {
          question: 'What is the vetting process like for EASWORKS?',
          content: [
            'The vetting process for EASWORKS can be summarized as follows:',
            '1.	Profile Approval:',
            '•	Complete your profile, ensuring it is comprehensive and accurate.',
            '•	The EASWORKS team will review and approve your profile.',
            '2.	Role Application:',
            '•	Once your profile is approved, you may receive invitations to apply for roles that match your skills and time zone.',
            '3.	First Interview:',
            '•	If your application is thorough and relevant, you may be invited to a first interview with the EASWORKS Talent team.',
            '•	This interview focuses on your work experience and its relevance to the specific role.',
            '4.	Technical Interview:',
            '•	Successful completion of the first interview leads to a second "technical" interview conducted by a member of the technical team.',
            '•	This interview delves deeper into technical discussions.',
            '5.	Vetting Outcome:',
            '•	If you pass the vetting process, you will be presented to the client.',
            '•	The client will have access to your public profile and may request an interview.',
            '6.	Client Interview:',
            '•	Each client follows their own interview approach.',
            '•	Prior to your client interview, you will receive instructions specific to that process.',
            'Note: The specific details and instructions may vary depending on the client and role.'
          ]
        },
        {
          question: 'Why is the vetting process necessary for EAS Talents?',
          content: [
            'The vetting process is essential for EAS Talents on the platform to ensure seamless project execution.',
            'All applicants must undergo a thorough screening that assesses their technical skills, behavior, domain expertise, industry experience, and professional skills necessary for their roles. ',
            'This process guarantees that our talent is well-equipped to excel in their positions and deliver successful outcomes.'
          ]
        },
        {
          question: 'What is the typical duration of the vetting process?',
          content: [
            'The vetting process usually takes 1-2 weeks, although it can be expedited based on the alignment and urgency of the role for both the EAS Talent and the employer. Its important to note that expediting the process does not mean skipping any crucial steps, as thorough candidate vetting is vital for the success of the engagement. '
          ]
        }
      ]
    },
    {
      name: 'Selection and Shortlisting Process for EASWORKS Clients',
      items: [
        {
          question: 'How can I increase my chances of getting an interview?',
          content: [
            'To improve your chances of getting selected for an interview, it is crucial to focus on the following:',
            '1.	Complete and Accurate Profile:',
            '•	Ensure that all sections of your EASWORKS profile are filled out accurately.',
            '•	This includes latest updated CV ,technical skill tests, WSA behavior assessment, project and portfolio updates, a brief video introducing yourself, and detailed professional experience and education background.',
            'By providing comprehensive and up-to-date information, you enhance your profiles appeal and increase the likelihood of being selected for an interview.'
          ]
        },
        {
          question: 'What happens after I apply to a job based on invitation?',
          content: [
            'After receiving an invitation to apply for a job that matches your skills and the clients requirements, the following steps typically occur:',
            '1.	Shortlisting:',
            '•	We carefully select 2-3 candidates per role, maximizing your chances of success.',
            '•	As your enterprise application skills have already been vetted, we pitch your profile to the client along with our recommendation of why you would be an excellent fit for the role.',
            '2.	Profile Selection: ',
            '•	If your profile is chosen, the EASWORKS team will contact you to schedule the next steps and move the process forward.',
            'In summary, once you apply for a job based on invitation, we prioritize the shortlisting process, highlighting your profile to the client along with our recommendation.',
            'If selected, the EASWORKS team will reach out to you to proceed further.'
          ]
        },
        {
          question: 'How will I be notified if a client wants to interview me after registration?',
          content: [
            'You will receive a direct interview invitation from us. To ensure you dont miss this important email, please add @EASWORKS.com to your address book to ensure proper delivery.'
          ]
        },
        {
          question: 'Why was my job application declined or rejected?',
          content: [
            'Each time your application doesnt make it to the finalist stage, you will receive direct feedback from us. Typically, declines occur due to incomplete or insufficiently compelling profiles, or a mismatch in fitment for the project requirements.',
            'To ensure your applications success, make sure your profile is complete and up-to-date with all the necessary information.'
          ]
        },
        {
          question: 'Why is my job application still under review?',
          content: [
            'The review process is ongoing, and there are several reasons for the delay:',
            '1.	Client pausing their search.',
            '2.	Continued acceptance of candidates for the role.',
            '3.	Changes in the job requirements.',
            'Rest assured that your application is being actively reviewed, and we appreciate your patience during this time.'
          ]
        }
      ]
    },
    {
      name: 'Finalizing the Candidature Process with EASWORKS Clients',
      items: [
        {
          question: 'What can I do to enhance my likelihood of being chosen for an interview?',
          content: [
            'Successfully navigating the EASWORKS client interview is similar to any other interview. Consider the following tips to increase your chances of selection:',
            '1.	Profile Completion: Ensure that your profile is thoroughly completed, including the skills assessment, and providing comprehensive details about your professional skills.',
            '2.	Experience Updates: Keep your experience section up to date by including your portfolio and a comprehensive list of enterprise application projects you have undertaken.',
            '3.	Domain and Industry Expertise: Highlight any specialized expertise you possess in specific domains or industries, as this can make you a more desirable candidate.',
            '4.	Certification and Credentials: If you have obtained any relevant certifications or credentials, be sure to include them in your profile. They demonstrate your knowledge and competence in your field.',
            'By adhering to these guidelines, you can significantly improve your prospects of being selected for an interview during the EASWORKS client process.'
          ]
        },
        {
          question: 'Is there a standardized interview process with clients for jobs on EASWORKS?',
          content: [
            'While each client and enterprise application job opportunity varies, the majority of EASWORKS clients typically require only 1-2 interviews to make their hiring decision. Being approved on EASWORKS allows you to bypass the usual screening, technical assessments, and work skill assessment interviews, saving time for both you and the employer.',
            'In certain cases where multiple stakeholders are involved or for specific roles with stringent requirements, some clients may request additional interviews. However, these interviews are generally lightweight in nature.'
          ]
        },
        {
          question: 'How long does it take to hear back from a client after an interview?',
          content: [
            'We advise clients to make a decision within seven days. However, in cases where multiple stakeholders are involved, the process may take longer. ',
            'If the timeline exceeds seven days, we will inform all candidates who are still being considered. Your dashboard will be regularly updated to reflect the status, and we work closely with the client to expedite the interview conclusion.',
            'If you havent received any communication from EASWORKS within seven days after the interview, please feel free to contact us at jobs@easworks.com'
          ]
        },
      ]
    },
    {
      name: 'Working As EASWORKS Freelancer',
      items: [
        {
          question: 'How does EASWORKS typically select freelancers for new enterprise application project opportunities?',
          content: [
            'Typical Steps Followed by EASWORKS for a new enterprise application project opportunity:',
            '1.	Talent Matching Process:',
            '•	The EASWORKS Enterprise Success Manager (ESM) initiates the Talent Matching process to find the best match between the Customer and Talent.',
            '•	If notified as a Talent Match by the ESM, proceed to the next step.',
            '2.	Client Interview:',
            '•	Decide whether to accept or pass on the client interview opportunity.',
            '•	If selected, a contract will be offered, specifying deliverables, expectations, and payment details.',
            '3.	Accepting the Contract:',
            '•	Once you accept the contract, you can begin working on the Customers project.'
          ]
        },
        {
          question: 'What factors should I consider when determining my hourly rate as a new freelancer in the field of Enterprise Application development?',
          content: [
            '•	Research Enterprise Application Freelance Rates for specific enterprise domain.',
            '•	Explore the rates of IT service companies that offer similar Enterprise Application services.',
            '•	Seek advice from fellow freelancers or "coworkers" in the industry.',
            '•	Talk to individuals who have previously hired freelancers to gain insights into their pricing expectations.',
            '•	Analyze the rates charged by other freelancers in your specific enterprise application domain.',
            '•	Consider the average range for your enterprise application services based on factors such as your location, experience, and market conditions.'
          ]
        },
        {
          question: 'How does the negotiation and contract process work on EASWORKS for freelancers?',
          content: [
            'Negotiations and contracts on EASWORKS follow a streamlined process:',
            '1.	Negotiations',
            '•	EASWORKS negotiates the hourly rate on your behalf when a client decides to hire you for enterprise project.',
            '•	In most cases, negotiations are not required as clients typically agree to the hourly rate you have specified in your profile.',
            '2.	Contract Execution:',
            '•	As an EASWORKS talent, you will enter into a comprehensive contractual agreement with EASWORKS for specific enterprise projects. This agreement governs your activities on the platform in accordance with the project requirements, including a non-disclosure agreement (NDA) clause to protect client information. It clearly defines your job responsibilities, roles, deliverables, mutually agreed-upon hourly rate, contract period, and time zone alignment.',
            '•	For each new job opportunity, EASWORKS facilitates the creation of a distinct contract involving the client and EASWORKS. This contract provides a detailed outline of the job responsibilities, roles, deliverables, project budget, contract period, performance assessment metrics, and any additional requirements as necessary.',
            '•	EASWORKS places a strong emphasis on securing pre-payment whenever feasible, ensuring financial security for both parties involved. Furthermore, EASWORKS supports the establishment of direct introductions between you and the client, facilitating a seamless transition and enabling you to promptly and efficiently commence work.',
            '3.	Long-Term Enterprise Projects:',
            '•	For long-term enterprise projects, EASWORKS offers clients the opportunity to conduct a risk-free trial period to assess the suitability of freelancers. This trial period, which spans from 20 to 40 hours on average, will be communicated to freelancers as part of the project evaluation process.',
            'EASWORKS manages these agreements, ensuring you are informed about the project duration agreed upon with the client.'
          ]
        },
        {
          question: 'What steps follows after signing of a contract with an EASWORKS client?',
          content: [
            'Once the contract is signed, the process proceeds as follows:',
            '•	EASWORKS establishes a collaboration platform, typically using Slack channels, to facilitate smooth engagement.',
            '•	You will be included in a channel alongside the client for ongoing communication throughout the enterprise application project.',
            '•	In addition, there will be a dedicated channel for communication exclusively between you and the EASWORKS team, ensuring effective coordination.',
            'After establishing direct contact with the client, whether through Slack or email, it is recommended to initiate an introductory call to initiate the project.',
            'To ensure efficient project management, it is advisable to establish a project cadence, including scheduled weekly office hours and check-in times with the client. If you need any assistance during the project kick-off phase, the EASWORKS Enterprise Success Manager (ESM) will serve as your primary point of contact.'
          ]
        },
        {
          question: 'What steps can be taken to effectively log hours on EASWORKS?',
          content: [
            'To log your hours effectively, we recommend following these steps:',
            '1.	Daily Activity Log:',
            '•	Use EASWORKS online timesheet tool to update your activity log on a daily basis.',
            '•	This provides the client with insight into the activities performed and the time spent on each activity.',
            '2.	Weekly Billable Hours Timesheet:',
            '•	The activity cum time log serves as the basis for your weekly billable hour’s timesheet.',
            '•	This timesheet will require client approval, and it is essential for upcoming payment processing.',
            'Remember, maintaining a detailed timesheet allows you to track how your time is spent, even on seemingly trivial activities.'
          ]
        },
        {
          question: 'Why and when is the trial period offered?',
          content: [
            'The trial period is offered on a case-by-case basis, typically spanning 20-40 hours. It allows clients to try out EASWORKS Talent, especially when they are new to this engagement model or unsure about the success rate. ',
            'This trial phase holds significant importance as it provides an opportunity for you to showcase your skills and capabilities. ',
            'Following the trial period, the aim is to secure recurring subscriptions from clients, enabling you to plan your work several months in advance.'
          ]
        }
      ]
    },
    {
      name: 'Payments',
      items: [
        {
          question: 'Does EASWORKS deduct a percentage from the hourly rate I establish?',
          content: [
            'No, the rate you set on your profile is the rate you receive. ',
            'It is important to note that determining your freelance rate requires careful consideration and research on prevailing rates in your enterprise application domain, taking into account your enterprise professional skills, experience, and other relevant factors.'
          ]
        },
        {
          question: 'What is the process for receiving payment and what are the billing policies of EASWORKS?',
          content: [
            'Upon successful onboarding on specific EASWORKS project, we will contact you to establish your billing profile. Depending on the location of your preferred bank account, you will either receive an email invitation to provide your information or we will personally communicate with you to gather the necessary details. ',
            'Our standard payment method involves ACH transfers, and the timeframe for receiving payment is typically 1-3 days from the initiation of the transfer, subject to the policies and processing times of your bank.'
          ]
        },
        {
          question: 'What is the expected payment timeline for EASWORKS talents?',
          content: [
            'Our payment terms for EASWORKS talents are set on a net 30 basis. This implies that the payment date for each billing period will be 30 days from every Friday. ',
            'We initiate payments manually a few days in advance of their due date to ensure timely processing.'
          ]
        }
      ]
    },
    {
      name: 'Work Skill Assessments (WSA)',
      items: [
        {
          question: 'What is the purpose of a Work Skill Assessment (WSA) or Behavioral assessment in the workplace?',
          content: [
            '•	The purpose of a WSA is to observe, understand, explain, and predict an individuals behavior in the workplace.',
            '•	It focuses on behavior, not personality traits.',
            '•	It assesses how individuals respond to favorable and challenging workplace situations.'
          ]
        },
        {
          question: 'How does Work Skill Assessment (WSA) differ from personality tests? ',
          content: [
            'Work Skill Assessment (WSA) or Behavioural assessments focus on assessing a persons actions, reactions, and expressions in different situations and roles. ',
            'On the other hand, personality tests aim to understand a persons overall qualities and characteristics.'
          ]
        },
        {
          question: 'Is the Work Skill Assessment (WSA) considered as a test?',
          content: [
            'No, the Work Skill Assessment (WSA) is not a test, but an assessment designed to gain insights into an individuals perspective and way of thinking. ',
            'It does not have right or wrong answers, and there is no pass or fail outcome. ',
            'The assessment simply reflects a persons view or perspective, and there is no incorrect response.'
          ]
        },
        {
          question: 'What is the methodology of a Work Skill Assessment (WSA) or Behavioral assessment?',
          content: [
            '•	The WSA is based on the widely recognized DISC theory (Dominance, Compliance, Influence, and Steadiness).',
            '•	It identifies whether response patterns are active or passive.',
            '•	The assessment can be completed in as little as 7 minutes.',
            '•	Real-time WSA results provide insights for recruiting managers to analyze a candidates suitability for a role quickly.'
          ]
        },
        {
          question: 'How does the Work Skill Assessment (WSA) function?',
          content: [
            'The WSA utilizes the DISC theory to analyze a persons fears, motivators, values, and behavioral style through profile factors: Dominance, Influence, Steadiness, and Compliance. ',
            'The EASWORKS Behavioral assessment tool incorporates these factors and tests candidates attitudes in each area. ',
            'The results are plotted on a graph and analyzed using proprietary technology, providing employers and recruiters with valuable insights into a candidates behavioral style and guiding the recruitment process.'
          ]
        },
        {
          question: 'How can the Work Skill Assessment (WSA) contribute to the recruitment process?',
          content: [
            'Work Skill Assessment (WSA) or Behavioural assessments eliminate uncertainties in recruitment by evaluating candidates behaviour and predicting their performance in the workplace.'
          ]
        },
        {
          question: 'How does Work Skill Assessment (WSA) performed on freelancers within EASWORKS benefit clients in the recruitment process?',
          content: [
            '•	The WSA evaluates freelancers interpersonal skills, providing insights into their capabilities.',
            '•	It helps assess the fit of freelancers for specific projects, ensuring they possess the required skills and behaviors.',
            '•	The WSA test assists in making informed decisions regarding freelancer selection, enhancing the quality of hires.',
            '•	By matching freelancers with client requirements, it improves project outcomes and client satisfaction.'
          ]
        }
      ]
    }
  ];

  private initFeaturedDomains() {

    const list$ = fromPromise(this.api.domains.homePageDomains(), []);


    const featured$ = computed(() => {
      const list = list$();
      const domainMap = this.domainState.domains.map$();
      const productMap = this.domainState.products.map$();

      if (domainMap.size === 0 || productMap.size === 0)
        return [];

      const featured = list.map(l => {
        const domain = domainMap.get(l.domain);
        if (!domain)
          throw new Error(`module '${l.domain}' not fond`);

        const products = l.products
          .map(p => {
            const product = productMap.get(p);
            if (!product)
              throw new Error(`module '${l.domain}' has no product '${p}'`);
            return product;
          });

        return {
          ...domain,
          products
        } as const;
      });

      return featured;
    });

    const loading$ = computed(() => featured$().length === 0);

    return {
      domains$: featured$,
      loading$
    };
  }
}
