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
  TFamilyMember,
  TGetFamilyMembersParams,
  TAddFamilyMemberPayload,
  TUpdateFamilyMemberPayload,
  TValidateNationalNumberPayload,
  TValidatePhoneNumbersPayload,
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
    //
    // getBeneficiaries: builder.query<
    //   TPaginatedResponse<TBenefieciary>,
    //   TGetBeneficiariesDto
    // >({
    //   query: (data) => ({
    //     url: "patients/search",
    //     body: data,
    //     method: "POST",
    //   }),
    //   transformResponse: (
    //     res: ApiResponse<TPaginatedResponse<TBenefieciary>>,
    //   ) => res.data,
    //   providesTags: ["Beneficiaries"],
    // }),
    getBeneficiaries: builder.infiniteQuery<
      TPaginatedResponse<TBenefieciary>,
      TGetBeneficiariesDto,
      number
    >({
      query: ({ queryArg, pageParam }) => ({
        url: "patients/search",
        method: "POST",
        body: { ...queryArg, pageNumber: pageParam },
      }),
      infiniteQueryOptions: {
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
          !lastPage.items.length || lastPage.items.length < lastPage.pageSize
            ? undefined
            : lastPage.pageNumber + 1,
      },
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TBenefieciary>>,
      ) => res.data,
      providesTags: ["Disclosures"],
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
        res: ApiResponse<TPaginatedResponse<TBeneficiaryMedicine>>,
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
    getFamilyMembers: builder.query<
      TPaginatedResponse<TFamilyMember>,
      TGetFamilyMembersParams | undefined
    >({
      query: (params) => ({
        url: "/family-members",
        method: "GET",
        params,
      }),
      transformResponse: (
        res: ApiResponse<TPaginatedResponse<TFamilyMember>>,
      ) => res.data,
      providesTags: [{ type: "family_Members", id: "LIST" }],
    }),
    addFamilyMember: builder.mutation<TFamilyMember, TAddFamilyMemberPayload>({
      query: (data) => ({
        url: "/family-members",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "family_Members", id: "LIST" }],
    }),
    updateFamilyMember: builder.mutation<void, TUpdateFamilyMemberPayload>({
      query: (data) => ({
        url: `/family-members`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_, __, arg) => [
        { type: "family_Members", id: "LIST" },
        { type: "family_Members", id: arg.id },
      ],
    }),
    validateNationalNumber: builder.mutation<
      TFamilyMember,
      TValidateNationalNumberPayload
    >({
      query: (data) => ({
        url: "patients/validate/national-number",
        method: "POST",
        body: data,
      }),
    }),
    validatePhoneNumbers: builder.mutation<void, TValidatePhoneNumbersPayload>({
      query: (data) => ({
        url: "patients/validate/phone-numbers",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export default beneficiaryApi;
