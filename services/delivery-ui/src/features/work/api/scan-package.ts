import { PackageAction } from '../enums/package-action.enum';
import { FetchedPackage } from '../types/fetched-package.type';
import { ApiResponse, ApiRoutes, ErrorResponse, apiFetch } from '@/core';

export const scanPackage = async (
  id: number,
  title: string,
  action: PackageAction
): Promise<ApiResponse<FetchedPackage>> => {
  try {
    const fetchResponse = await apiFetch(ApiRoutes.ScanPackage, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        title,
        action,
      }),
    });

    if (!fetchResponse.ok) {
      const response = (await fetchResponse.json()) as ErrorResponse;
      return { success: false, message: response.message };
    }

    const response = (await fetchResponse.json()) as FetchedPackage;
    return { success: true, data: response };
  } catch {
    return {
      success: false,
      message: 'An unknown error occurred while trying to update package information.',
    };
  }
};
