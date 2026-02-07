export type TCity = {
  id: string;
  name: string;
};

export type TAddCityPayload = {
  name: string;
};

export type TUpdateCityPayload = {
  id: string;
  name: string;
};

export type TCityWithData = TCity & {
  areasCount?: number;
  employeesCount?: number;
};
