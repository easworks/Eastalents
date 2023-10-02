export interface GenericRole {
    herosection: {
        title: {
          highlight: string;
        };
        cta: string;
    };
    
    Skillssection: {
        title: {
            highlight: string;
        };
        responsibilities: {
            title: string;
            content: string[];
        }
        Skills: {
            title: string;
            content: string[];
        }
    }

    howtohire: {
        title: {
            highlight: string;
          }; 
    }

    specifysection: {
        cta: string;
    }
}
export const GENERIC_ROLE_DATA: Readonly<Record<string, GenericRole>> = {
    'enterprise-application-developer': {
        herosection: {
            title: {
              highlight: 'Enterprise Application Developer',
            },
            cta: 'Enterprise Application Developer'
        },

        Skillssection: {
            title: {
                highlight: 'Enterprise Application Developer'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Responsible for the actual coding and implementation of complex enterprise-level applications, often working in collaboration with front-end and back-end developers. Focuses on scalability, reliability, and performance in a multi-user environment.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Expertise in enterprise-level programming languages like Java EE, .NET, or C++; understanding of enterprise design patterns; knowledge of database systems; familiarity with enterprise integration tools.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Enterprise Application Developer',
              },
        },

        specifysection: {
            cta: 'Enterprise Application Developer '
        }
    },

    'enterprise-domain-consultant': {
        herosection: {
            title: {
              highlight: 'Enterprise Domain Consultant',
            },
            cta: 'Enterprise Domain Consultant'
        },

        Skillssection: {
            title: {
                highlight: 'Enterprise Domain Consultant'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Specializes in the specific business domain (e.g., finance, healthcare, supply chain) for which the application is being developed. Provides expertise to ensure that the application meets the specialized needs and compliance requirements of the domain.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Domain-specific knowledge, analytical thinking, and consultative expertise.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Enterprise Domain Consultant',
              },
        },

        specifysection: {
            cta: 'Enterprise Domain Consultant '
        }
    },

    'solution-architect': {
        herosection: {
            title: {
              highlight: 'Solution Architect',
            },
            cta: 'Solution Architect'
        },

        Skillssection: {
            title: {
                highlight: 'Solution Architect'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Designs the overall structure of the application, including how components interact within the enterprise ecosystem.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'System architecture, technology selection, problem-solving.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Solution Architect',
              },
        },

        specifysection: {
            cta: 'Solution Architect '
        }
    },

    'business-analyst': {
        herosection: {
            title: {
              highlight: 'Business Analyst',
            },
            cta: 'Business Analyst'
        },

        Skillssection: {
            title: {
                highlight: 'Business Analyst'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Understands the business needs, gathers requirements, and creates technical requirements and functional designs for the application.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Analytical thinking, requirements gathering, stakeholder management.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Business Analyst',
              },
        },

        specifysection: {
            cta: 'Business Analyst '
        }
    },

    'project-manager': {
        herosection: {
            title: {
              highlight: 'Project Manager',
            },
            cta: 'Project Manager'
        },

        Skillssection: {
            title: {
                highlight: 'Project Manager'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Oversees the entire project, sets timelines, allocates resources, and ensures that objectives are met and ensuring alignment with enterprise goals.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Project management, leadership, excellent communication.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Project Manager',
              },
        },

        specifysection: {
            cta: 'Project Manager '
        }
    },

    'enterprise-architect': {
        herosection: {
            title: {
              highlight: 'Enterprise Architect',
            },
            cta: 'Enterprise Architect'
        },

        Skillssection: {
            title: {
                highlight: 'Enterprise Architect'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Provides a high-level view of the enterprise`s strategic vision, aligning it with technology. This role often oversees the Solution Architects and ensures that the application fits into the larger enterprise ecosystem.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Strategic thinking, knowledge of enterprise systems, leadership, and communication.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Enterprise Architect',
              },
        },

        specifysection: {
            cta: 'Enterprise Architect '
        }
    },

    'designers-ui-ux-designers': {
        herosection: {
            title: {
              highlight: 'Designers (UI/UX Designers)',
            },
            cta: 'Designers (UI/UX Designers)'
        },

        Skillssection: {
            title: {
                highlight: 'Designers (UI/UX Designers)'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Responsible for designing the user interface and user experience. Works closely with front-end developers and business analysts to create intuitive, user-friendly designs and aligned with business needs.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Expertise in design software like Adobe XD, Sketch, or Figma; understanding of user behavior and psychology; ability to create wireframes, mockups, and prototypes.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Designers (UI/UX Designers)',
              },
        },

        specifysection: {
            cta: 'Designers (UI/UX Designers) '
        }
    },

    'quality-assurance-qa-tester': {
        herosection: {
            title: {
              highlight: 'Quality Assurance (QA) Tester',
            },
            cta: 'Quality Assurance (QA) Tester'
        },

        Skillssection: {
            title: {
                highlight: 'Quality Assurance (QA) Tester'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Responsible for designing the user interface and user experience. Works closely with front-end developers and business analysts to create intuitive, user-friendly designs and aligned with business needs.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Expertise in design software like Adobe XD, Sketch, or Figma; understanding of user behavior and psychology; ability to create wireframes, mockups, and prototypes.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Quality Assurance (QA) Tester',
              },
        },

        specifysection: {
            cta: 'Quality Assurance (QA) Tester '
        }
    },

    'front-end-developer': {
        herosection: {
            title: {
              highlight: 'Front-End Developer',
            },
            cta: 'Front-End Developer'
        },

        Skillssection: {
            title: {
                highlight: 'Front-End Developer'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Implements the user-facing components of the application, ensuring enterprise-level usability.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'HTML, CSS, JavaScript, UI/UX design.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Front-End Developer',
              },
        },

        specifysection: {
            cta: 'Front-End Developer '
        }
    },

    'back-end-developer': {
        herosection: {
            title: {
              highlight: 'Back-End Developer',
            },
            cta: 'Back-End Developer'
        },

        Skillssection: {
            title: {
                highlight: 'Back-End Developer'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Develops the application`s server-side logic, ensuring data storage and retrieval meet enterprise standards.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Server-side programming languages (e.g., Java, Python), database management.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Back-End Developer',
              },
        },

        specifysection: {
            cta: 'Back-End Developer '
        }
    },

    'full-stack-developer': {
        herosection: {
            title: {
              highlight: 'Full-Stack Developer',
            },
            cta: 'Full-Stack Developer'
        },

        Skillssection: {
            title: {
                highlight: 'Full-Stack Developer'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Engages in both front-end and back-end development activities, providing a comprehensive approach to application development.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Proficiency in both front-end and back-end technologies.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Full-Stack Developer',
              },
        },

        specifysection: {
            cta: 'Full-Stack Developer '
        }
    },

    'devOps-engineer': {
        herosection: {
            title: {
              highlight: 'DevOps Engineer',
            },
            cta: 'DevOps Engineer'
        },

        Skillssection: {
            title: {
                highlight: 'DevOps Engineer'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Manages the infrastructure for enterprise application development, automates workflows, and oversees deployment.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'Infrastructure management, automation, CI/CD (Continuous Integration/Continuous Deployment).'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'DevOps Engineer',
              },
        },

        specifysection: {
            cta: 'DevOps Engineer '
        }
    },

    'database-administrator-dba': {
        herosection: {
            title: {
              highlight: 'Database Administrator (DBA)',
            },
            cta: 'Database Administrator (DBA)'
        },

        Skillssection: {
            title: {
                highlight: 'Database Administrator (DBA)'
            },
            responsibilities: {
                title: 'Responsibilities',
                content: [
                    'Manages the database systems, ensures data integrity, and optimizes performance to support enterprise application development.'
                ]
            },
            Skills: {
                title: 'Skills',
                content: [
                    'SQL, database design, performance tuning.'
                ]
            }
        },

        howtohire: {
            title: {
                highlight: 'Database Administrator (DBA)',
              },
        },

        specifysection: {
            cta: 'Database Administrator (DBA) '
        }
    }
}