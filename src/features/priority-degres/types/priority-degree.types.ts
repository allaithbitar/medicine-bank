export type TPriorityDegree = {
  id: string;
  name: string;
  color: string | null;
  durationInDays: number | null;
};

export type TAddPriorityDegreeDto = Pick<TPriorityDegree, 'name'> & {
  color?: string;
  durationInDays?: number;
};

export type TUpdatePriorityDegreeDto = TAddPriorityDegreeDto & { id: string };

export type TGetPriorityDegreesDto = { name?: string };
