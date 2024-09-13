import { FetchedPackage } from '../types/fetched-package.type';
import { ApiResponse, ApiRoutes, ErrorResponse, apiFetch } from '@/core';

export const getPackageById = async (id: number): Promise<ApiResponse<FetchedPackage>> => {
  try {
    const fetchResponse = await apiFetch(ApiRoutes.GetPackageById.replace('{id}', id.toString()));

    if (!fetchResponse.ok) {
      const response = (await fetchResponse.json()) as ErrorResponse;
      return { success: false, message: response.message };
    }

    const response = (await fetchResponse.json()) as FetchedPackage;
    return { success: true, data: response };
  } catch {
    return {
      success: false,
      message: 'An unknown error occurred while trying to get package information from API.',
    };
  }
};
