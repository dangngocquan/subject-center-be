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
