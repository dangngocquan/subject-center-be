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
