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
      content: string;
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
        'paragraph 1',
        'paragraph 2'
      ],
      lottie: 'lott-file-link',
      cta: 'Start to Implement Digital Transformation Initiatives',
    },
    stepper: {
      title: {
        plain: 'How',
        highlight: 'Digital Continuity & Transformation (DX) works'
      },
      lottie: '',
      steps: [
        {
          title: '',
          content: ''
        }
      ]
    }
  }
};
