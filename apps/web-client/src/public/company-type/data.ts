export interface CompanyType {
  herosection: {
    logo: string;
    title: {
      plain: string;
      highlight: string;
      plainLast: string;
    };
    content: string[];
    cta: string;
  };

  StrategicBenefits: {
    title: {
      plain: string;
      highlight: string;
      plainLast: string;
    };
    cta: string;
  };

  HowdDoesEasworks: {
    title: {
      plain: string;
      highlight: string;
      plainLast: string;
    };
    cta: string;
  };

  ProfessionalsBased: {
    title: {
      plain: string;
      highlight: string;
    };
    ProfessionalList: {
      title: string;
    }[];
  };

  EASServicesBlock: {
    ServiceBlock: {
      title: {
        plain: string;
        highlight: string;
      },
      content: {
        title: string;
      }[];
    }[];
  };

  BottomHireSection: {
    title: {
      plain: string;
      highlight: string;
    };
    cta: string;
  };

}

export const COMPANY_TYPE_DATA: Readonly<Record<string, CompanyType>> = {
  'small-business': {
    herosection: {
      logo: '/assets/img/Small_medium_Business_Exp.webp',
      title: {
        plain: 'Scale Like an Enterprise, Budget Like a',
        highlight: 'Small & Medium Businesses (SMBs):',
        plainLast: 'Hire Enterprise Application Talents Now!'
      },
      content: [
        'Simplified Hiring for Exceptional Enterprise Developers, Business Analyst, and Project Managers. Unlock On-Demand Access Like Never Before.'
      ],
      cta: 'Hire Now'
    },
    StrategicBenefits: {
      title: {
        plain: 'Strategic Benefits for',
        highlight: 'Small and Medium Businesses (SMBs)',
        plainLast: 'Leveraging EASWORKS:'
      },
      cta: 'Hire Now'
    },
    HowdDoesEasworks: {
      title: {
        plain: 'How does EASWORKS support',
        highlight: 'Small and Medium Businesses (SMBs)',
        plainLast: '?'
      },
      cta: 'Start Hiring'
    },
    ProfessionalsBased: {
      title: {
        plain: 'SMBs',
        highlight: 'Engage EAS Professionals Based on Roles and Skillsets'
      },
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
    EASServicesBlock: {
      ServiceBlock: [
        {
          title: {
            plain: 'EAS Services for',
            highlight: 'Small & Medium Businesses(SMBs) :',
          },
          content: [
            {
              title: 'Business Intelligence'
            },
            {
              title: 'Enterprise Application Integration'
            },
            {
              title: 'Custom Enterprise Application'
            },
            {
              title: 'Enterprise Application Testing'
            },
            {
              title: 'Data Migration'
            },
            {
              title: 'Support & Maintenance'
            },
          ]
        },

        {
          title: {
            plain: 'Small & Medium Businesses(SMBs)',
            highlight: '- Project Engagement Options:',
          },
          content: [
            {
              title: 'Flexible Hourly or Fixed-Fee Engagements.'
            },
            {
              title: 'Fully managed Enterprise Application '
            },
            {
              title: 'Tailored Hiring for Diverse Enterprise Application Needs'
            },
          ]
        },
      ],
    },
    BottomHireSection: {
      title: {
        plain: 'Hire top tier Enterprise Application talents  for',
        highlight: 'Small & Medium Businesses (SMBs).'
      },
      cta: 'Hire Now'
    },
  },

  'startups': {
    herosection: {
      logo: '/assets/img/StartupsCom.webp',
      title: {
        plain: 'Scale Like an Enterprise, Budget Like a',
        highlight: 'Startups',
        plainLast: 'Hire Enterprise Application Talents Now!'
      },
      content: [
        'Simplified Hiring for Exceptional Enterprise Developers, Business Analyst, and Project Managers. Unlock On-Demand Access Like Never Before.'
      ],
      cta: 'Hire Now'
    },
    StrategicBenefits: {
      title: {
        plain: 'Strategic Benefits for',
        highlight: 'Startups',
        plainLast: 'Leveraging EASWORKS:'
      },
      cta: 'Hire Now'
    },
    HowdDoesEasworks: {
      title: {
        plain: 'How does EASWORKS support',
        highlight: 'Startups',
        plainLast: '?'
      },
      cta: 'Start Hiring'
    },
    ProfessionalsBased: {
      title: {
        plain: 'Startups',
        highlight: 'Engage EAS Professionals Based on Roles and Skillsets'
      },
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
    EASServicesBlock: {
      ServiceBlock: [
        {
          title: {
            plain: 'EAS Services for',
            highlight: 'Startups :',
          },
          content: [
            {
              title: 'Enterprise Application Design'
            },
            {
              title: 'Business Intelligence'
            },
            {
              title: 'Enterprise Application Integration'
            },
            {
              title: 'Custom Enterprise Application'
            },
            {
              title: 'Enterprise Application Testing'
            },
            {
              title: 'Data Migration'
            },
            {
              title: 'Support & Maintenance'
            },
          ]
        },

        {
          title: {
            plain: 'Startups',
            highlight: '- Project Engagement Options:',
          },
          content: [
            {
              title: 'Flexible Hourly or Fixed-Fee Engagements.'
            },
            {
              title: 'Fully managed Enterprise Application '
            },
            {
              title: 'Tailored Hiring for Diverse Enterprise Application Needs'
            },
          ]
        },
      ],
    },
    BottomHireSection: {
      title: {
        plain: 'Hire top tier Enterprise Application talents  for',
        highlight: 'Startups'
      },
      cta: 'Hire Now'
    },
  },

  'enterprise': {
    herosection: {
      logo: '/assets/img/EnterpriseCom.webp',
      title: {
        plain: 'Achieve Enterprise Application Success: Streamline Projects with Flexible EASWORKS Expert Talent on demand and Agile Solutions',
        highlight: '',
        plainLast: ''
      },
      content: [
        'Simplified Hiring for Exceptional Enterprise Developers, Business Analyst, and Project Managers. Unlock On-Demand Access Like Never Before.'
      ],
      cta: 'Start Hiring'
    },
    StrategicBenefits: {
      title: {
        plain: 'Strategic Benefits for',
        highlight: 'Enterprises',
        plainLast: 'Leveraging EASWORKS:'
      },
      cta: 'Hire Now'
    },
    HowdDoesEasworks: {
      title: {
        plain: 'How does EASWORKS support',
        highlight: 'Enterprises',
        plainLast: '?'
      },
      cta: 'Start Hiring'
    },
    ProfessionalsBased: {
      title: {
        plain: 'Enterprises',
        highlight: 'Engage EAS Professionals Based on Roles and Skillsets'
      },
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
    EASServicesBlock: {
      ServiceBlock: [
        {
          title: {
            plain: 'EAS Services for',
            highlight: 'Enterprises :',
          },
          content: [
            {
              title: 'Digital Transformation (DX)'
            },
            {
              title: 'Enterprise Application Design'
            },
            {
              title: 'Business Intelligence'
            },
            {
              title: 'Application Modernization'
            },
            {
              title: 'Enterprise Application Integration'
            },
            {
              title: 'Custom Enterprise Application'
            },
            {
              title: 'Enterprise Application Testing'
            },
            {
              title: 'Data Migration'
            },
            {
              title: 'Support & Maintenance'
            },
          ]
        },

        {
          title: {
            plain: 'Enterprises',
            highlight: '- Project Engagement Options:',
          },
          content: [
            {
              title: 'Flexible Hourly or Fixed-Fee Engagements.'
            },
            {
              title: 'Fully managed Enterprise Application '
            },
            {
              title: 'Tailored Hiring for Diverse Enterprise Application Needs'
            },
            {
              title: 'Permanent Hire'
            },
          ]
        },
      ],
    },
    BottomHireSection: {
      title: {
        plain: 'Hire top tier Enterprise Application talents  for',
        highlight: 'Enterprises.'
      },
      cta: 'Hire Now'
    },
  },

  'professional-service-provider': {
    herosection: {
      logo: '/assets/img/ProfessionalServiceProviderCom.webp',
      title: {
        plain: 'Struggling to compete in today’s competitive Enterprise Application Talent market?',
        highlight: '',
        plainLast: ''
      },
      content: [
        'Thousands of Professional Service Provider or Agencies trusts EASWORKS to hire top Enterprise Developers, Business Analyst, Enterprise Architect and Project Managers.'
      ],
      cta: 'Start Hiring'
    },
    StrategicBenefits: {
      title: {
        plain: 'Strategic Benefits for',
        highlight: 'Professional Service Provider or Agencies',
        plainLast: 'Leveraging EASWORKS:'
      },
      cta: 'Hire Now'
    },
    HowdDoesEasworks: {
      title: {
        plain: 'How does EASWORKS support',
        highlight: 'Professional Service Provider or Agencies',
        plainLast: '?'
      },
      cta: 'Start Hiring'
    },
    ProfessionalsBased: {
      title: {
        plain: 'Professional Service Provider or Agencies',
        highlight: 'Engage EAS Professionals Based on Roles and Skillsets'
      },
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
    EASServicesBlock: {
      ServiceBlock: [
        {
          title: {
            plain: 'EAS Services for',
            highlight: 'Professional Service Provider or Agencies :',
          },
          content: [
            {
              title: 'Digital Transformation (DX)'
            },
            {
              title: 'Enterprise Application Design'
            },
            {
              title: 'Business Intelligence'
            },
            {
              title: 'Application Modernization'
            },
            {
              title: 'Enterprise Application Integration'
            },
            {
              title: 'Custom Enterprise Application'
            },
            {
              title: 'Enterprise Application Testing'
            },
            {
              title: 'Data Migration'
            },
            {
              title: 'Support & Maintenance'
            },
          ]
        },

        {
          title: {
            plain: 'Professional Service Provider or Agencies',
            highlight: '- Project Engagement Options:',
          },
          content: [
            {
              title: 'Flexible Hourly or Fixed-Fee Engagements.'
            },
            {
              title: 'Fully managed Enterprise Application '
            },
            {
              title: 'Tailored Hiring for Diverse Enterprise Application Needs'
            },
            {
              title: 'Permanent Hire'
            },
          ]
        },
      ],
    },
    BottomHireSection: {
      title: {
        plain: 'Hire top tier Enterprise Application talents  for',
        highlight: 'Professional Service Provider or Agencies.'
      },
      cta: 'Hire Now'
    },
  },


};