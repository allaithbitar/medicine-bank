import { rootApi } from "@/core/api/root.api";
import type {
  TAddBeneficiaryDto,
  TBenefieciary,
  TGetBeneficiariesDto,
  TBeneficiaryMedicine,
  TUpdateBeneficiaryDto,
  TGetBeneficiaryMedicinesParams,
  TAddBeneficiaryMedicinePayload,
  TUpdateBeneficiaryMedicinePayload,
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
      TGetBeneficiariesDto
    >({
      query: (data) => ({
        url: "patients/search",
        body: data,
        method: "POST",
      }),
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TBenefieciary>>
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
    getBeneficiaryMedicines: builder.query<
      TPaginatedResponse<TBeneficiaryMedicine>,
      TGetBeneficiaryMedicinesParams
    >({
      query: (params) => ({
        url: "/medicines/patient",
        method: "GET",
        params,
      }),
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TBeneficiaryMedicine>>
      ) => res.data,
      providesTags: [{ type: "Beneficiary_Medicines", id: "LIST" }],
    }),
    addBeneficiaryMedicine: builder.mutation<
      TBeneficiaryMedicine,
      TAddBeneficiaryMedicinePayload
    >({
      query: (body) => ({
        url: "/medicines/patient",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Beneficiary_Medicines", id: "LIST" }],
    }),
    updateBeneficiaryMedicine: builder.mutation<
      void,
      TUpdateBeneficiaryMedicinePayload
    >({
      query: (body) => ({
        url: "/medicines/patient",
        method: "PUT",
        body,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: "Beneficiary_Medicines", id: "LIST" },
        { type: "Beneficiary_Medicines", id: arg.id },
      ],
    }),
  }),
});

export default beneficiaryApi;
