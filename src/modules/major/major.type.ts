export type TMajor = {
  id?: number;
  name?: string;
  subjects?: TSubject[];
};

export type TSubject = {
  id?: number;
  name?: string;
  code?: string;
  credit?: number;
  prerequisites?: string[];
  majorId?: number;
};
