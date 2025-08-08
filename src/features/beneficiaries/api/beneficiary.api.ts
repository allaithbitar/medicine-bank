import { rootApi } from "@/core/api/root.api";
import type {
  TAddBeneficiaryDto,
  TBenefieciary,
  TSearchBeneficiariesDto,
  TUpdateBeneficiaryDto,
} from "../types/beneficiary.types";
import type {
  ApiResponse,
  TPaginatedResponse,
} from "@/core/types/common.types";

export const beneficiaryApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    addBeneficiary: builder.mutation<void, TAddBeneficiaryDto>({
      query: (data) => ({
        url: "patients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Beneficiaries"],
    }),

    updateBeneficiary: builder.mutation<void, TUpdateBeneficiaryDto>({
      query: (data) => ({
        url: "patients",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, args) => [
        { type: "Beneficiaries", id: args.id },
      ],
    }),

    getBeneficiaries: builder.query<
      TPaginatedResponse<TBenefieciary>,
      TSearchBeneficiariesDto
    >({
      query: (data) => ({
        url: "patients/search",
        body: data,
        method: "POST",
      }),
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TBenefieciary>>,
      ) => res.data,
      providesTags: ["Beneficiaries"],
    }),
    getBeneficiary: builder.query<TBenefieciary, { id: string }>({
      query: ({ id }) => ({
        url: `patients/${id}`,
      }),
      transformResponse: (res: ApiResponse<TBenefieciary>) => res.data,
      providesTags: (_, __, args) => [{ type: "Beneficiaries", id: args.id }],
    }),
  }),
});

export default beneficiaryApi;
