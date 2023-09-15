export interface CompanyType {
    herosection: {
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
    }

    EASServicesBlock: {
        ServiceBlock: [
            {
                title: {
                    plain: string;
                    highlight: string;
                },
                content: {
                    title: string[];
                };
            }
            
        ];
    }

    BottomHireSection: {
        title: {
            plain: string;
            highlight: string;
        };
        cta: string;
    }

}

export const COMPANY_TYPE_DATA: Readonly<Record<string, CompanyType>> = {
    'small-business': {
        herosection: {
            title: {
                plain: 'test one',
                highlight: 'one',
                plainLast: 'urjdk'
            },
            content: [
                'EASWORKS helps on your Digital continuity & Transformation to transform your business using pioneering enterprise technologies skills to become digitally ready with all legacy applications. EASWORKS proven tech-skills and experience help businesses gain maximum benefits in your digital transformation journey.'
            ],
            cta: 'hire'
        },
        StrategicBenefits: {
            title: {
                plain: 'test tow',
                highlight: 'ijedieff',
                plainLast: 'urjdk'
            },
            cta: 'wwefff'
        },
        HowdDoesEasworks: {
            title: {
                plain: 'test tow',
                highlight: 'ijedieff',
                plainLast: 'urjdk'
            },
            cta: 'wwefff'
        },
        ProfessionalsBased: {
            title: {
                plain: 'test tow',
                highlight: 'ijedieff'
            },
            ProfessionalList: [
                {
                    title: 'ddsddd'
                },
                {
                    title: 'posasposa'
                },
                {
                    title: 'masskasko'
                }
            ]
        },
        EASServicesBlock: {
            ServiceBlock: [
                {
                    title: {
                        plain: 'sdsdsddds',
                        highlight: 'dsdsdsd',
                    },
                    content: {
                        title: [
                            'edhehiuhe',
                            'edhehiuhe',
                            'edhehiuhe',
                            'edhehiuhe',
                            'edhehiuhe'
                        ],
                    },
                }
                
            ],
            
        },
        BottomHireSection: {
            title: {
                plain: 'sdsdssd',
                highlight: 'opeprrjnf'
            },
            cta: 'oirenjdnc'
        },
    },

    
}