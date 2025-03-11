export enum EGradeLatin {
  A_PLUS = 'A+',
  A = 'A',
  B_PLUS = 'B+',
  B = 'B',
  C_PLUS = 'C+',
  C = 'C',
  D_PLUS = 'D+',
  D = 'D',
  F = 'F',
}

export const GRADE_CONVERSION_LATIN_TO_4 = {
  [EGradeLatin.A_PLUS]: 4.0,
  [EGradeLatin.A]: 3.7,
  [EGradeLatin.B_PLUS]: 3.5,
  [EGradeLatin.B]: 3,
  [EGradeLatin.C_PLUS]: 2.5,
  [EGradeLatin.C]: 2.0,
  [EGradeLatin.D_PLUS]: 1.5,
  [EGradeLatin.D]: 1.0,
  [EGradeLatin.F]: 0.0,
};

export const GRADE_GRADUATION = [
  {
    minGrade4: 3.6,
    type: 'EXCELLENT',
    description: 'Excellent (3.6 - 4.0) - Outstanding performance',
  },
  {
    minGrade4: 3.2,
    type: 'VERY_GOOD',
    description:
      'Very Good (3.2 - 3.59) - Strong performance with minor weaknesses',
  },
  {
    minGrade4: 2.5,
    type: 'GOOD',
    description:
      'Good (2.5 - 3.19) - Solid performance with some areas of improvement',
  },
  {
    minGrade4: 2,
    type: 'ORDINARY',
    description: 'Ordinary (2.0 - 2.49) - Acceptable but needs improvement',
  },
  {
    minGrade4: 1,
    type: 'POOR',
    description: 'Poor (1.0 - 1.99) - Below satisfactory level',
  },
];
