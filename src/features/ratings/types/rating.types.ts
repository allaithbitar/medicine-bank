export type TRating = {
  id: string;
  name: string;
  description: string | null;
  code: string;
};

export type TGetRatingsDto = Partial<Omit<TRating, 'id'>>;

export type TAddRatingDto = Pick<TRating, 'name' | 'code'> & Partial<Pick<TRating, 'description'>>;

export type TUpdateRatingDto = TAddRatingDto & Pick<TRating, 'id'>;
