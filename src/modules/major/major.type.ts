export type TMajor = {
  id?: number;
  name?: string;
  items?: TMajorItem[];
};

export type TMajorItem = {
  id?: number;
  name?: string; // Represents 'name_vn' in the entity
  code?: string; // Represents 'course_code' in the entity
  credit?: number; // Represents 'credits' in the entity
  prerequisites?: string[];
  majorId?: number;
  genCode?: string;
  parentGenCode?: string | null;
  stt?: string;
  level?: number;
  selectionRule?: 'ALL' | 'ONE' | 'MULTI' | null;
  minCredits?: number | null;
  minChildren?: number | null;
  isLeaf?: boolean;
  createdAt: Date;
  updatedAt: Date;
};
