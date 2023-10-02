export interface ServiceType {
  name: string;
  herosection: {
    title: {
      plain: string;
      highlight: string;
      plainLast: string;
    };
    content: string[];
  };

  ApplicationData: {
    title: {
      plain: string;
      highlight: string;
      plainLast: string;
    };
    content: string[];
  };

  ProfessionalsBased: {
    title: {
      plain: string;
      highlight: string;
      plainLast: string;
    };
    content: string[];
    ProfessionalList: {
      title: string;
    }[];
  };

  ForSteps: {
    title: {
      plain: string;
      highlight: string;
      plainLast: string;
    };
    ContentBox: {
      icon: string;
      title: string;
      content: string;
    }[];
  };

  TeamsOnDemand: {
    title: string,
    content: string,
    TableData: {
      TableTitle: string;
      contentA: string;
      contentB: string;
    }[];
  };

  BottomHireSection: {
    title: {
      plain: string;
      highlight: string;
    };
    cta: string;
  };

  BenefitBusiness: {
    title: {
      plain: string;
      highlight: string;
      plainLast: string;
    };
  };
}

export const SERVICE_TYPE_DATA: Readonly<Record<string, ServiceType>> = {
  'direct-hiring': {
    name: 'Direct Hiring',
    herosection: {
      title: {
        plain: 'Your Go-To Dedicated Enterprise Applications Software(EAS) Platform for',
        highlight: 'Direct Hiring',
        plainLast: 'of top Talents.',
      },
      content: [
        'EASWORKS offers a specialized, reliable, and efficient avenue for permanent hires in the enterprise application field, ensuring that you get the best talent with the relevant deep industry experience needed for your EAS project.',
      ]
    },

    ApplicationData: {
      title: {
        plain: 'EASWORKS: Changing the Game in',
        highlight: 'Permanent Staffing',
        plainLast: 'for Enterprise Applications',
      },
      content: [
        '🎓 Specialized Skillset: Tailored to the enterprise application sector, connecting you with technically and industrially competent candidates.',
        '🎯 Stringent Screening: Comprehensive evaluations to ensure only top-notch, qualified talent for your projects.',
        '🏭 Industry Depth: Offering candidates with not just the technical acumen but also in-depth industry experience tailored to your project.',
        '💰 Cost Savings: Minimize long-term expenses and risks by hiring the right talent from the get-go.',
        '🛠️ Full-Scope Support: Comprehensive assistance from project conception to legal formalities, letting you focus on what you do best.'
      ]
    },

    ProfessionalsBased: {
      title: {
        plain: 'Hire',
        highlight: 'DIRECT STAFFING',
        plainLast: 'for Enterprise Application Software (EAS)'

      },
      content: [
        'Choosing Direct Staffing with EASWORKS offers you specialized talent, stringent vetting, industry-specific expertise, cost-efficiency, and comprehensive support, simplifying your hiring process and enhancing enterprise application project success.'
      ],
      ProfessionalList: [
        {
          title: 'ERP Operations and Services (ERP Ops)'
        },
        {
          title: 'Enterprise Content Management (ECM)'
        },
        {
          title: 'Artificial Intelligence (AI)'
        },
        {
          title: 'ERP Financial Management (ERP Finance)'
        },
        {
          title: 'Human Capital Management (HCM)'
        },
        {
          title: 'Enterprise Quality Management Software (EQMS)'
        },
        {
          title: 'Customer Relationship Management  (CRM)'
        },
        {
          title: 'Business Analytics and BI (BI)'
        },
        {
          title: 'IT Service Management (ITSM)'
        },
        {
          title: 'Product Lifecycle Management (PLM)'
        },
        {
          title: 'Supply Chain Management (SCM)'
        },
        {
          title: 'Manufacturing Execution System (MES)'
        },
        {
          title: 'Project Portfolio Management (PPM)'
        },
        {
          title: 'Infrastructure as a Service (IaaS)'
        },
        {
          title: 'Internet of Things (IoT)'
        },
        {
          title: 'ERP Operations and Services (ERP Ops)'
        },
        {
          title: 'Enterprise Content Management (ECM)'
        },
        {
          title: 'Artificial Intelligence (AI)'
        },

      ]
    },

    ForSteps: {
      title: {
        plain: 'EASWORKS: 4-Step',
        highlight: 'Direct Hiring',
        plainLast: 'Process for Enterprise Applications'
      },
      ContentBox: [
        {
          icon: '',
          title: 'Requirement Gathering',
          content: 'Define roles, skills, and responsibilities for targeted recruitment.'
        },
        {
          icon: '',
          title: 'Candidate Pooling',
          content: 'Choose from EASWORKS vast network of Enterprise Application experts to assemble a curated selection for evaluation.'
        },
        {
          icon: '',
          title: 'Interviews and Assessments',
          content: 'Evaluate candidates for skills, culture fit, and job alignment.'
        },
        {
          icon: '',
          title: 'Offer and Onboarding',
          content: 'Make offers and initiate streamlined onboarding for successful candidates to join on your payroll & work with your team .'
        }
      ]
    },

    TeamsOnDemand: {
      title: '',
      content: '',
      TableData: [
        {
          TableTitle: '',
          contentA: '',
          contentB: '',
        },
        {
          TableTitle: '',
          contentA: '',
          contentB: '',
        }
      ]
    },

    BottomHireSection: {
      title: {
        plain: 'Revolutionize Your Talent Search with EASWORKS: Streamlined Direct Hiring for Expertise That Fits Your Enterprise Needs!',
        highlight: ''
      },
      cta: 'Hire Now'
    },

    BenefitBusiness: {
      title: {
        plain: 'Do you have further inquiries about how EASWORKS - ',
        highlight: 'Direct Hire',
        plainLast: 'benefit your business?'
      }
    }

  },

  'fully-managed-team': {
    name: 'Fully-Managed Team',
    herosection: {
      title: {
        plain: 'End-to-End Enterprise Application Lifecycle Management Services with EASWORKS',
        highlight: 'Fully-Managed Team',
        plainLast: '',
      },
      content: [
        'Achieve rapid development or implementation of end-to-end Enterprise Application Services (EAS) by leveraging our elite EAS Talent teams, enabling project initiation at 6X the speed without compromising quality and by reducing your project time by outsourcing to EASWORKS for managing the complete end to end project delivery.',
      ]
    },

    ApplicationData: {
      title: {
        plain: 'What Makes EASWORKS',
        highlight: 'Fully-Managed',
        plainLast: 'Enterprise Application Services(EAS) the Optimal Choice ?',
      },
      content: [
        'Boost Your Enterprise Projects with EASWORKS Fully-Managed Team of Experts in Enterprise Application Software: Our carefully curated team of elite freelancers is primed to expedite the success of your enterprise application software (EAS) projects, while we take full responsibility for delivering results.'
      ]
    },

    ProfessionalsBased: {
      title: {
        plain: 'Hire',
        highlight: 'Fully-Managed Team',
        plainLast: 'for Enterprise Application Software (EAS)'

      },
      content: [
        'Fully-Managed Team service offering allows you to outsource  enterprise applications you are working in, whether it be CRM, Enterprise Resource Planning (ERP), PLM, Business Intelligence (BI), or any other specialized area.'
      ],
      ProfessionalList: [
        {
          title: 'Solution Architect'
        },
        {
          title: 'Functional Consultant'
        },
        {
          title: 'Solution Architect'
        },
        {
          title: 'Functional Consultant'
        },
        {
          title: 'ERP Project Manager'
        },
        {
          title: 'CRP Project Manager'
        },
        {
          title: 'PLM Project Manager'
        },
        {
          title: 'HRMS Project Manager'
        },
        {
          title: 'ERP Developer'
        },
        {
          title: 'Developer'
        },
        {
          title: 'PLM Developer'
        },
        {
          title: 'Developer'
        },
        {
          title: 'Business Analyst'
        },
        {
          title: 'Developer'
        },
        {
          title: 'PLM Developer'
        },
        {
          title: 'Security Engineer'
        },
        {
          title: 'Quality Assurance (QA) Engineer'
        },
        {
          title: 'Quality Assurance (QA) Engineer'
        },
        {
          title: 'Test Engineer'
        },
        {
          title: 'Quality Assurance (QA) Engineer'
        },

      ]
    },

    ForSteps: {
      title: {
        plain: 'Process for',
        highlight: 'Full-Managed Team',
        plainLast: 'services Engagement'
      },
      ContentBox: [
        {
          icon: '',
          title: 'Expertise',
          content: 'Specialized knowledge ensures top-quality service delivery.'
        },
        {
          icon: '',
          title: 'End-to-End Management',
          content: 'Complete oversight of the project offers a hassle-free experience.'
        },
        {
          icon: '',
          title: 'Scalability',
          content: 'The ability to adapt and scale services to meet evolving business needs.'
        },
        {
          icon: '',
          title: 'Cost-Efficiency',
          content: 'The service may offer long-term cost savings compared to training and maintaining an in-house team.'
        },
        {
          icon: '',
          title: 'Focus on Core Business',
          content: 'Enables your company to concentrate on primary business activities while the service takes care of specialized tasks.'
        }
      ]
    },

    TeamsOnDemand: {
      title: 'Teams On-Demand vs. Fully Managed',
      content: 'Is Fully Managed services right for you and your next Enterprise Application software(EAS) project?',
      TableData: [
        {
          TableTitle: 'Project Delivery Accountability',
          contentA: 'No',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Global Talent Pool',
          contentA: 'Yes',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Flexible Talent Matching',
          contentA: 'Yes',
          contentB: 'No',
        },
        {
          TableTitle: 'Team Integration',
          contentA: 'Yes',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Project Management Outsourcing',
          contentA: 'No',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Self-Management',
          contentA: 'Yes',
          contentB: 'No',
        },
        {
          TableTitle: 'Comprehensive Team Support',
          contentA: 'Yes',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Budget and Timeline Flexibility',
          contentA: 'Yes',
          contentB: 'No',
        },
        {
          TableTitle: 'Reduced Workload for In-House team',
          contentA: 'Yes',
          contentB: 'Yes',
        }
      ]
    },

    BottomHireSection: {
      title: {
        plain: 'Transform Your Enterprise Goals into Reality—Hire EASWORKS Fully-Managed Team Today!',
        highlight: ''
      },
      cta: 'Hire Fully-Managed Team'
    },

    BenefitBusiness: {
      title: {
        plain: 'Do you have further inquiries about how EASWORKS',
        highlight: 'Fully-Managed Team Services',
        plainLast: 'can benefit your business?'
      }
    }


  },


  'individual-talent': {
    name: 'Individual Talent',
    herosection: {
      title: {
        plain: 'Hire Top',
        highlight: 'Individual Talent',
        plainLast: 'with EASWORKS Flexible Engagement Models',
      },
      content: [
        'Hire Top Enterprise Application Freelancer  with Flexible Hourly or Fixed-Fee Engagements with deep Industry Knowledge whether it is short or long term engagement!',
      ]
    },

    ApplicationData: {
      title: {
        plain: 'Hire Marketers right here, right now',
        highlight: '',
        plainLast: '',
      },
      content: [
        'Hire marketers with experties across email, paid, social, amazon, brand, SEO, content, programmatic, and more.'
      ]
    },

    ProfessionalsBased: {
      title: {
        plain: 'Hire',
        highlight: 'Top Freelancers',
        plainLast: 'by role and skills'

      },
      content: [
        'Discover a diverse range of Freelancer  on the EASWORKS network. Find the perfect fit for short or long-term engagements.'
      ],
      ProfessionalList: [
        {
          title: 'Enterprise Application Developer'
        },
        {
          title: 'Business Analyst'
        },
        {
          title: 'Database Administrator (DBA)'
        },
        {
          title: 'Integration Specialist'
        },
        {
          title: 'Solution Architect'
        },
        {
          title: 'Mobile App Developer'
        },
        {
          title: 'Software Engineer'
        },
        {
          title: 'System Administrator'
        },
        {
          title: 'Full Stack Developer'
        },
        {
          title: 'Cloud Engineer'
        },
        {
          title: 'Front-end Developer'
        },
        {
          title: 'Security Engineer'
        },
        {
          title: 'Data Analyst'
        },
        {
          title: 'DevOps Engineer'
        },
        {
          title: 'Back-end Developer'
        },
        {
          title: 'IT Infrastructure Architect'
        },
        {
          title: 'Quality Assurance (QA) Engineer'
        },
        {
          title: 'Project Manager'
        },
        {
          title: 'Test Automation Engineer'
        },
        {
          title: 'UI/UX Designer'
        },

      ]
    },

    ForSteps: {
      title: {
        plain: 'Process for',
        highlight: 'Individual Talents',
        plainLast: 'Engagement'
      },
      ContentBox: [
        {
          icon: '',
          title: 'Specify Your Requirements',
          content: 'Clearly outline your project needs, objectives, and expectations.'
        },
        {
          icon: '',
          title: 'Talent Screening and Assessment',
          content: 'Freelancing platforms conduct rigorous screening and evaluate freelancers skills, expertise, and industry experience.'
        },
        {
          icon: '',
          title: 'Meet the Matches',
          content: 'Review Talent profiles, portfolios, and performance metrics to identify the best matches for your project with Flexible Hourly or Fixed-Fee Engagement model.'
        },
        {
          icon: '',
          title: 'Seamless Integration',
          content: 'Once you have selected the freelancers who align with your needs, you seamlessly integrate them into your project team.'
        },
      ]
    },

    TeamsOnDemand: {
      title: '',
      content: '',
      TableData: [
        {
          TableTitle: '',
          contentA: '',
          contentB: '',
        },
      ]
    },

    BottomHireSection: {
      title: {
        plain: 'Hire Top Enterprise Application Freelancers with flexible engagement model. Get Started Today!',
        highlight: ''
      },
      cta: 'Start Hiring'
    },

    BenefitBusiness: {
      title: {
        plain: 'Do you have further inquiries about how EASWORKS - ',
        highlight: 'Individual Talents',
        plainLast: 'can benefit your business? '
      }
    }


  },


  'teams-on-demand': {
    name: 'Teams-on-Demand',
    herosection: {
      title: {
        plain: 'Accelerate Enterprise Application Projects with EASWORKS',
        highlight: 'Teams On-Demand',
        plainLast: 'Deployment',
      },
      content: [
        'Achieve rapid development or implementation of Enterprise Application Software (EAS) by leveraging our pre-assembled EAS Talent teams, enabling project initiation at 4X the speed of conventional methods, without compromising quality.',
      ]
    },

    ApplicationData: {
      title: {
        plain: 'What Makes EASWORKS',
        highlight: 'Teams On-Demand',
        plainLast: 'Service the Optimal Choice ?',
      },
      content: [
        'Fast-Track Your Enterprise Projects with EASWORKS Teams On-Demand: A single click connects you to our curated pool of elite freelancers specialized in enterprise application software. This ready-to-deploy team is designed to expedite the success of your enterprise application software(EAS) project. Benefit from rapid deployment, exceptional project control, and the ability to launch in as little as 48 hours.'
      ]
    },

    ProfessionalsBased: {
      title: {
        plain: 'Hire',
        highlight: 'Teams On-Demand',
        plainLast: 'by Enterprise Application Domain'

      },
      content: [
        'Teams On-Demand service offering allows you to hire teams that are tailored to the specific domain of enterprise applications you are working in, whether it be CRM, Enterprise Resource Planning (ERP), PLM, Business Intelligence (BI), or any other specialized area.'
      ],
      ProfessionalList: [
        {
          title: 'ERP'
        },
        {
          title: 'CRP'
        },
        {
          title: 'PLM'
        },
        {
          title: 'HRMS'
        },
        {
          title: 'Solution Architect'
        },
        {
          title: 'Functional Consultant'
        },
        {
          title: 'Solution Architect'
        },
        {
          title: 'Functional Consultant'
        },
        {
          title: 'ERP Developer'
        },
        {
          title: 'Developer'
        },
        {
          title: 'PLM Developer'
        },
        {
          title: 'Developer'
        },
        {
          title: 'Business Analyst'
        },
        {
          title: 'Developer'
        },
        {
          title: 'PLM Developer'
        },
        {
          title: 'Security Engineer'
        },
        {
          title: 'Quality Assurance (QA) Engineer'
        },
        {
          title: 'Quality Assurance (QA) Engineer'
        },
        {
          title: 'Test Engineer'
        },
        {
          title: 'Quality Assurance (QA) Engineer'
        },

      ]
    },

    ForSteps: {
      title: {
        plain: 'Process for hiring',
        highlight: 'Teams On-Demand',
        plainLast: 'Engagement'
      },
      ContentBox: [
        {
          icon: '',
          title: 'Define Project Scope',
          content: 'Clearly articulate your project requirements, goals, and desired outcomes to ensure you get the most suitable team.'
        },
        {
          icon: '',
          title: 'Expert Vetting Process',
          content: 'EASWORKS conducts a thorough assessment of freelancers, evaluating their skills, domain expertise, and industry experience to ensure quality.'
        },
        {
          icon: '',
          title: 'Team Selection',
          content: 'Browse through curated profiles, portfolios, and performance metrics to choose the best-suited talent, available on either an hourly or fixed-fee engagement model.'
        },
        {
          icon: '',
          title: 'Effortless Team Integration',
          content: 'After identifying the freelancers that meet your project needs, effortlessly incorporate them into your existing team structure for seamless project execution, and you will manage the team.'
        },
      ]
    },

    TeamsOnDemand: {
      title: 'Teams On-Demand vs. Fully Managed',
      content: 'Is Teams On-Demand right for you and your next Enterprise Application project?',
      TableData: [
        {
          TableTitle: 'Global Talent Pool',
          contentA: 'Yes',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Flexible Talent Matching',
          contentA: 'Yes',
          contentB: 'No',
        },
        {
          TableTitle: 'Team Integration',
          contentA: 'Yes',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Project Management Outsourcing',
          contentA: 'No',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Self-Management',
          contentA: 'Yes',
          contentB: 'No',
        },
        {
          TableTitle: 'Comprehensive Team Support',
          contentA: 'Yes',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Budget and Timeline Flexibility',
          contentA: 'Yes',
          contentB: 'No',
        },
        {
          TableTitle: 'Reduced Workload for In-House team',
          contentA: 'Yes',
          contentB: 'Yes',
        },
        {
          TableTitle: 'Project Delivery Accountability',
          contentA: 'No',
          contentB: 'Yes',
        },
      ]
    },

    BottomHireSection: {
      title: {
        plain: 'Unlock Rapid Success: Hire Specialized',
        highlight: 'Teams On-Demand with EASWORKS!'
      },
      cta: 'Hire your Teams On-Demand'
    },

    BenefitBusiness: {
      title: {
        plain: 'Do you have further inquiries about how EASWORKS',
        highlight: 'Teams On-Demand',
        plainLast: 'can benefit your business?'
      }
    }


  }

};