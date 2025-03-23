import { EGradeLatin } from '../grade-conversion/constants';

export type TPlan = {
  id?: number;
  name?: string;
  accountId?: number;
  items?: TPlanItem[];
};

export type TPlanItem = {
  id?: number;
  name?: string;
  code?: string;
  credit?: number;
  prerequisites?: string[];
  grade4?: number;
  gradeLatin?: string;
  planId?: number;
};

export enum EPlanCPAMarkType {
  GRADUATION_MARK = 'GRADUATION_MARK',
  MIN = 'MIN',
  MAX = 'MAX',
  CURRENT = 'CURRENT',
}

export type TPlanCPA = {
  marks?: {
    grade4?: number;
    type?: EPlanCPAMarkType;
    details?: {
      content?: string;
      isPossibly?: boolean;
      cases?: {
        grades?: { gradeLatin?: EGradeLatin; credits?: number }[];
      }[];
    };
  }[];
};

export type TPlanCPASummary = {
  withImprovements?: TPlanCPA;
  withoutImprovements?: TPlanCPA;
};

export type TPlanCreditSummary = {
  items?: TPlanItem[];
  totalCredits?: number;
  totalSubjects?: number;
  totalSubjectsCompleted?: number;
  totalCreditsCompleted?: number;
  totalSubjectsIncomplete?: number;
  totalCreditsIncomplete?: number;
  totalSubjectsCanImprovement?: number;
  totalCreditsCanImprovement?: number;
  currentCPA?: number;
  grades?: Partial<Record<EGradeLatin, number>>;
  totalGradeCompleted?: number;
  totalGradeCanImprovement?: number;
};

export type TPlanSummary = {
  credits?: TPlanCreditSummary;
  cpa?: TPlanCPASummary;
};
