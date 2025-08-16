export type TPriorityDegree = {
  id: string;
  name: string;
  color: string | null;
};

export type TAddPriorityDegreeDto = Pick<TPriorityDegree, "name"> & {
  color?: string;
};

export type TUpdatePriorityDegreeDto = TAddPriorityDegreeDto & { id: string };

export type TGetPriorityDegreesDto = { name?: string };
