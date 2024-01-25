export interface UseCase {
  hero: {
    title: {
      plain: string;
      highlight: string;
    };
    content: string[];
    lottie: string;
    cta: string;
  };
  stepper: {
    title: {
      plain: string;
      highlight: string;
    };
    lottie: string;
    steps: {
      title: string;
      content: string[];
    }[];
  };

}

export const USE_CASE_DATA: Readonly<Record<string, UseCase>> = {
  'digital-transformation': {
    hero: {
      title: {
        plain: 'Digital Transformation',
        highlight: '(DX)'
      },
      content: [
        'EASWORKS helps on your Digital continuity & Transformation to transform your business using pioneering enterprise technologies skills to become digitally ready with all legacy applications. EASWORKS proven tech-skills and experience help businesses gain maximum benefits in your digital transformation journey.',
      ],
      lottie: 'https://lottie.host/4c9690fd-2f7c-4f2d-8d17-189cd10faa13/ZVqeAIMqEv.json',
      cta: 'Start to Implement Digital Transformation Initiatives',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'Digital Continuity & Transformation (DX) works'
      },
      lottie: 'https://assets4.lottiefiles.com/packages/lf20_tdxghhik.json',
      steps: [
        {
          title: 'Identify the problems you want to solve',
          content: [
            'The first step is to start with WHY and clearly define your Digital transformation strategic objectives which may be to expand your business? Is it about keeping up with competitors? Or maybe you just want to improve overall efficiency.'
          ]
        },
        {
          title: 'Create and foster a digital culture',
          content: [
            'To provide new software onboarding for all your employees to teach them how to use new enterprise application solutions. Continuous support should also be available until they feel comfortable working with these tools.'
          ]
        },
        {
          title: 'Map and analyze your current business processes',
          content: [
            'Start with a few impactful and concrete initiatives that will show measurable results within the first few months. Mapping and analyzing existing business processes will help you identify inefficiencies and opportunities for improvement.'
          ]
        },
        {
          title: 'Invest in the right digital solutions',
          content: [
            'Redesign your operating processes to get the most out of the new technologies and start creating business value within few months.'
          ]
        },
        {
          title: 'Focus on continuous improvement',
          content: [
            'Reach out to customers, partners, employees, and other relevant stakeholders to ask for their feedback. Digital transformation is not a one-time event. Businesses need to continuously transform to create new value, stay competitive, and thrive in the digital age.'
          ]
        },
      ]
    }
  },

  'innovation': {
    hero: {
      title: {
        plain: 'Innovation enabled by',
        highlight: 'Design Thinking process'
      },
      content: [
        'EASWORKS enables Innovation led by Design thinking software development with focus on SOLUTION to reinvent your enterprise application portfolio, making use of emerging technology and building with speed and agility to enable you to meet business needs, now and in the future.',
      ],
      lottie: 'https://lottie.host/24cc3e35-b8db-4ea0-a1ba-b32a2f697da6/AgufANxAwn.json',
      cta: 'Start Innovation-led approach',
    },
    stepper: {
      title: {
        plain: 'How Innovation enabled by',
        highlight: 'Design Thinking process works'
      },
      lottie: 'https://assets10.lottiefiles.com/packages/lf20_w26e86eb.json',
      steps: [
        {
          title: 'Problem Analysis from Different Perspective',
          content: [
            'Define the problem, the end goal and work towards the solution to achieve the desired objectives.'
          ]
        },
        {
          title: 'Determine Its Root Cause',
          content: [
            'Professionals get the chance to explore the problem for themselves from the perspective of Customer’s needs.'
          ]
        },
        {
          title: 'Encourages Innovative Thinking & Creative Problem Solving',
          content: [
            'The process involves a great deal of brainstorming and formulating new ideas that can help to expand your organization & enables innovation and creativity to solve the problems that customers face daily.'
          ]
        },
        {
          title: 'Outcome Meet Clients Requirements',
          content: [
            'This involves prototyping with iterative approach that are designed with the design thinking approach will meet the objectives and client expectations.'
          ]
        },
        {
          title: 'Create Value While Solving Real Problems',
          content: [
            'Innovation enabled by Design Thinking process specifically directed at creating value and solving problems, from small to large, in almost any industry.'
          ]
        },
      ]
    }
  },

  'prototyping': {
    hero: {
      title: {
        plain: '',
        highlight: 'Prototyping'
      },
      content: [
        'EASWORKS helps to generate simple experimental model of a proposed Enterprise Application solution with different technologies & approaches to test or validate ideas, design assumptions and other aspects of its conceptualization quickly and cheaply.',
      ],
      lottie: 'https://lottie.host/da0ab755-9ffb-44dd-acf1-af038e744642/AbXDubIFQZ.json',
      cta: 'Start Prototyping',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'Enterprise Application prototyping works ?'
      },
      lottie: 'https://assets1.lottiefiles.com/packages/lf20_syloy0qc.json',
      steps: [
        {
          title: 'FEASIBILITY PROTOTYPES',
          content: [
            '(i) For prototyping new enterprise application or technology. ',
            '(ii) Engineer writes just enough code to see if it`s feasible.',
            '(iii) Helps understand technical risk, often related to performance.'
          ],
        },
        {
          title: 'LOW-FIDELITY USER PROTOTYPES',
          content: [
            '(i) Essentially an interactive wireframe (doesn`t look real).',
            '(ii)Created by interactive designers to test the workflow.',
            '(iii)Simulates process to identify usability issues early.'
          ]
        },
        {
          title: 'HIGH-FIDELITY USER PROTOTYPES',
          content: [
            '(i) Realistic looking, working simulation.',
            '(ii)Good for communicating a proposed product to stakeholders.',
            '(iii)Used in defensive user testing, not to see if they`ll like it, but to learn if they wo`t.'
          ]
        },
        {
          title: 'LIVE-DATA PROTOTYPES',
          content: [
            '(i) Very limited implementation created by developers to prove it works.',
            '(ii)Has access to real data and is sent real live traffic.',
            '(iii)Hasn`t been "productized" (no test automation, SEO, localization, etc.).'
          ]
        },
      ]
    }
  },

  'enterprise-application-integration': {
    hero: {
      title: {
        plain: 'Enterprise Application Integration',
        highlight: '(EAI)'
      },
      content: [
        'EASWORKS helps data flow freely between applications without significant changes to database configurations or the applications themselves, leading to a streamlined process and increased data availability.',
      ],
      lottie: 'https://lottie.host/c0792fd1-027a-4eeb-801b-52b35b8e9624/VorTfvoJLp.json',
      cta: 'Implement Enterprise Application Integration',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'Enterprise Application Integrations (EAI) works ?'
      },
      lottie: 'https://assets7.lottiefiles.com/packages/lf20_8zmfnsdi.json',
      steps: [
        {
          title: 'Point-to-point integration',
          content: [
            'Data is taken from one source, perhaps reformatted, and then ingested by the next application which is suited for small workflows and a few tools.'
          ],
        },
        {
          title: 'Hub-and-spoke integration',
          content: [
            'This approach uses a central program to facilitate the data and steps between the participation applications. The program can handle the data reformatting and keep workflows moving in the event of an application slowdown.'
          ]
        },
        {
          title: 'Enterprise Bus integration (ESB)',
          content: [
            'In a common bus design, all participating applications use a set of standards to send and receive data or workflows.'
          ]
        },
        {
          title: 'Middleware integration',
          content: [
            'This involves an intermediary program that sits between the end user and the underlying application. Middleware supports interface integration and may have an underlying hub-and-spoke or bus design.'
          ]
        },
        {
          title: 'Microservices',
          content: [
            'These can be serverless functions or dedicated apps designed to integrate easily or quickly connect programs. Microservices can often be easily offloaded as cloud workloads.'
          ]
        },
      ]
    }
  },

  'application-modernization': {
    hero: {
      title: {
        plain: 'Application modernization',
        highlight: '(Application migration)'
      },
      content: [
        'EASWORKS helps Application migration of moving software applications between different computing environments including languages, frameworks and infrastructure platforms with below different approaches.',
        '(i) Rehost (lift & shift)',
        '(ii) Retain (hybrid)',
        '(iii) Retire',
        '(iv) Repurchase (drop & shop)',
        '(v) Refactoting (rearchitect)',
        '(vi) Replatforming (lift & optimize)',
      ],
      lottie: 'https://lottie.host/b49f7ed3-7477-4e11-b459-ba4e84f73f41/Pl7fmKo631.json',
      cta: 'Start Application Integration',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'is Application migration performed ?'
      },
      lottie: 'https://assets2.lottiefiles.com/packages/lf20_wjkdowmi.json',
      steps: [
        {
          title: 'Migration Assessment',
          content: [
            'Firstly, collect all the information about the enterprise application in terms of tech stack, scalability, future requirements, etc. Prioritize the application based on the parts you need to migrate.'
          ],
        },
        {
          title: 'Migration Designing & Planning',
          content: [
            'Choose type of migration environment (hybrid, cloud or on-premises) and work on the design and planning by gaining a 360-degree view of the dependencies of the application.'
          ]
        },
        {
          title: 'Working on Architecture & Code',
          content: [
            'In the application migration service, there is a need to adjust and update the application code and design as per the new software environment which requires various code conversion tools work on the code and design.'
          ]
        },
        {
          title: 'Data Migration',
          content: [
            'Creating a script to automate the migration, data preparation, extracting, loading, and shifting to the new environment.'
          ]
        },
        {
          title: 'Trial Migration',
          content: [
            'Trial application migration step is performed to minimize the risk and perform the final migration in a real-time environment.'
          ]
        },
        {
          title: 'Final Migration, Testing & Deployment',
          content: [
            'The final migration occurs in this stage after multiple iteration of validating the Trial mock-up results and to set up the new environment, DevOps tools, and migrate the application.'
          ]
        },
      ]
    }
  },

  'enterprise-application-design': {
    hero: {
      title: {
        plain: 'Enterprise Application',
        highlight: 'Design'
      },
      content: [
        'EASWORKS helps to provide effective and efficient Enterprise Application UI Design & Enterprise Software UX Design to streamline business processes, reduce errors, and reduce user frustration to deliver best in class design for your Enterprise Application.',
      ],
      lottie: 'https://lottie.host/6cd7a0ca-c8e5-4f78-bdcd-25f0d6d8066b/88foE2hAa4.json',
      cta: 'Start UX/UI Designing',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'Enterprise Application Designs works ?'
      },
      lottie: 'https://assets7.lottiefiles.com/packages/lf20_ikbsx61i.json',
      steps: [
        {
          title: 'UI/UX Design- For End-to-end development',
          content: [
            'EASWORKS partners with you at each step of the process to understand your needs and ensure that our enterprise application solution integrates smoothly into your existing enterprise application software ecosystem while delivering an exceptional experience for your users.'
          ],
        },
        {
          title: 'Greenfield Design',
          content: [
            'EASWORKS Designers will work closely with the user community to ensure that the UX meets their needs. As the software is developed, they provide critical feedback that will guarantee that the UX of the final product remains focused and productive.'
          ]
        },
        {
          title: 'Redesign - Legacy Application Support',
          content: [
            'EASWORKS helps to completely redesign an application`s UX or help minimize the impact on the application`s design while allowing new features to be integrated as Enterprise applications evolve throughout their lifetimes.'
          ]
        },
      ]
    }
  },

  'business-intelligence': {
    hero: {
      title: {
        plain: '',
        highlight: 'Business Intelligence'
      },
      content: [
        'EASWORKS helps to use Business Analytics & Business Intelligence technologies used for the data analysis of business information and refers to a range of tools that provide quick, easy-to-digest access to insights of your organization`s current state, based on available data.',
      ],
      lottie: 'https://lottie.host/fbafaf32-a5a8-4a76-ab00-6b0b882e187f/FrPuBm1o9l.json',
      cta: 'Start using Business Analytics & Business Intelligence tools',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'Business Analytics (BA) & Business Intelligence (BI) works ?'
      },
      lottie: 'https://assets8.lottiefiles.com/packages/lf20_u9d7gukw.json',
      steps: [
        {
          title: 'Choose COTS BA/BI tools or consider a custom solution',
          content: [
            'Choose BA/BI tools for sources of data (ERP ,CRM, PLM, SCM, website analytics, external sources, etc.)'
          ],
        },
        {
          title: 'Gather a business intelligence team',
          content: [
            'BI team helps together representatives from different departments to department-specific insights about required data and its sources.',
            '(i) Domain represntatives',
            '(ii) BI-specific roles'
          ]
        },
        {
          title: 'Document your BI strategy',
          content: [
            'Start developing a BI strategy and document your strategy using traditional strategic documents such as a product roadmap.'
          ]
        },
        {
          title: 'Set up data integration tools',
          content: [
            'To connect with data warehouse with the sources of information by ETL (Extract, Transform, Load) tools or data integration tools.',
            'a) Data extraction : The ETL tool retrieves data from the data sources including ERP, CRM, PLM, SCM , analytics, and spreadsheets.',
            'b) Data transformation : Once extracted, the ETL tool starts data processing. All extracted data is analyzed, have duplicates removed, and then is standardized, sorted, filtered, and verified.',
            'c) Data loading : At this phase, transformed data is uploaded into the warehouse.'
          ]
        },
        {
          title: 'Configure a data warehouse and choose an architectural approach',
          content: [
            'Warehouses is connected with data sources and ETL systems on one end and reporting tools or dashboard interfaces on the other. This allows for presenting data from various systems via a single interface.'
          ]
        },
        {
          title: 'Implement the end-user interface: reporting tools and dashboards',
          content: [
            'BI is used to produce interactive dashboards with customizable portions of information. And templated reporting remains the most popular method of data presentation.'
          ]
        },
        {
          title: 'Conduct training for end users',
          content: [
            'Training sessions to onboard end users like video-hints or interactive onboarding tools that lead users through steps for embedded analytical tool in ERP or CRM or PLM.'
          ]
        }
      ]
    }
  },

  'custom-enterprise-application': {
    hero: {
      title: {
        plain: '',
        highlight: 'Custom Enterprise Application Development'
      },
      content: [
        'EASWORKS helps to build Custom Enterprise Application software development which are aimed to serve a particular set of business requirements for your organization which is not possible in Commercial off-the-shelf Applications (COTS).',
      ],
      lottie: 'https://lottie.host/61f54bac-ee62-484d-8908-2aa4644c600b/Cf0ihIA945.json',
      cta: 'Start to develop Custom Enterprise Application',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'Custom Enterprise Application Development happens ?'
      },
      lottie: 'https://assets2.lottiefiles.com/packages/lf20_rjibs4ai.json',
      steps: [
        {
          title: 'Discovery',
          content: [
            'Drawing up high-level functional and technical requirements to software & Eliciting business needs and concerns regarding the existing and desired business process flows.'
          ],
        },
        {
          title: 'Enterprise software planning and design',
          content: [
            'Deciding on the architectural style of the new enterprise software system (mostly, point-to-point/event-driven service-based or microservices) and developing its detailed design.'
          ]
        },
        {
          title: 'UX and UI design',
          content: [
            'UX designers and Business Analysts collaborate on UX research to understand the target audience and UX designers create wireframes that demonstrate basic content layout and functionality.'
          ]
        },
        {
          title: 'EAS development and testing',
          content: [
            'Front end & Back-end development – to build both client & the server side and APIs of new enterprise software. Testing usually runs in parallel with development.'
          ]
        },
        {
          title: 'Data conversion and uploading',
          content: [
            'Inspecting the legacy data to migrate & Deciding on the supported data formats and handling the required conversions by ETL migration process.'
          ]
        },
        {
          title: 'EAS deployment',
          content: [
            'Enterprise Application Software (EAS) gets deployed and integrated with the required corporate infrastructure through staging and testing environments.'
          ]
        },
        {
          title: 'Further EAS evolution in iterations',
          content: [
            'The development and delivery of new working software modules continue iteratively until business requirement is met.'
          ]
        },
      ]
    }
  },

  'data-migration': {
    hero: {
      title: {
        plain: '',
        highlight: 'Data Migration'
      },
      content: [
        'EASWORKS provides data migration service to move data between storage systems, applications, or formats with ETL process which would be needed during upgrading of databases, deploying a new application or switching from on-premises to cloud-based storage and applications.',
        'EASWORKS supports different migration types:',
        '(i) Database migration',
        '(ii) Storage migration',
        '(iii) Business process migration',
        '(iv) Application migration',
        '(v) Datacenter migration',
        '(vi) Cloud migration',
      ],
      lottie: 'https://lottie.host/74dd853e-638d-4dbf-9120-4420cfae8331/lO1RikmPXS.json',
      cta: 'Start Data migration',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'is Data migration performed ?'
      },
      lottie: 'https://assets9.lottiefiles.com/packages/lf20_jcf1usol.json',
      steps: [
        {
          title: 'PLAN',
          content: [
            'This initial phase is to assess and clean the source data, analyze business requirements, risks, assumption and dependencies, develop and test your migration scenarios, and define a formal data migration plan.'
          ],
        },
        {
          title: 'EXECUTE',
          content: [
            'Data preparation, extraction, transformation, and loading happens during Execute phase and duration is determined upon data migration approach- big bang or phase-based approach migration.'
          ]
        },
        {
          title: 'VERIFY',
          content: [
            'Validate migration: Check whether all the required data is transferred, if there are correct values in the target tables and if there was any data loss.',
            'Retire old systems: The final step in the migration process is to shut down and dispose of the legacy systems which supported your source data.'
          ]
        },
      ]
    }
  },

  'support-and-maintenance': {
    hero: {
      title: {
        plain: 'Enterprise Application Maintenance & Support',
        highlight: '(EAMS)'
      },
      content: [
        'EASWORKS provides Enterprise Application support and maintenance with different service offerings depending on the type, business criticality, and specific requirements of your applications.',
      ],
      lottie: 'https://lottie.host/0eac63f0-c4f9-4871-978c-a0022af48c10/E0JHkNudaq.json',
      cta: 'Start EAS Support',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'Enterprise Application support and maintenances performed ?'
      },
      lottie: 'https://assets9.lottiefiles.com/packages/lf20_jcf1usol.json',
      steps: [
        {
          title: 'Enterprise Application support',
          content: [
            'EASWORKS provides resolution of identified issues of different complexity (from basic usage problems to application code/database defects).',
            'L0 - Creating and maintaining detailed information for user self-service.',
            'L1 - Solving basic enterprise application usage issues.',
            'L2 - Fixing application configuration and infrastructure issues.',
            'L3 - Resolving enterprise application issues on the code level.',
          ],
        },
        {
          title: 'Enterprise Application maintenance',
          content: [
            'In support of introducing of new enterprise application features and integrations along with continuous application monitoring and optimization.',
            '(i) Application evolution -upgrade',
            '(ii) Application performance management',
            '(iii) Application security management',
          ]
        },
      ]
    }
  },
};
