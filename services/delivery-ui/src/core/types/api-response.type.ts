type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

type ApiFailureReponse = {
  success: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureReponse;
