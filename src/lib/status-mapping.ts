import {
  ApiDispatchStatus,
  FormDispatchStatus,
  ApiStatus,
  FormStatus,
} from "@/types/dispatch";

// Map API status to Form status
export const mapApiStatusToFormStatus = (apiStatus: ApiStatus): FormStatus => {
  const statusMap: Record<ApiStatus, FormStatus> = {
    [ApiDispatchStatus.PENDING]: FormDispatchStatus.PENDING,
    [ApiDispatchStatus.SEARCHING_DRIVER]: FormDispatchStatus.PENDING,
    [ApiDispatchStatus.DRIVER_ASSIGNED]: FormDispatchStatus.ACCEPTED,
    [ApiDispatchStatus.PICKED_UP]: FormDispatchStatus.IN_PROGRESS,
    [ApiDispatchStatus.IN_TRANSIT]: FormDispatchStatus.IN_PROGRESS,
    [ApiDispatchStatus.DELIVERED]: FormDispatchStatus.COMPLETED,
    [ApiDispatchStatus.CANCELLED]: FormDispatchStatus.CANCELLED,
    [ApiDispatchStatus.FAILED]: FormDispatchStatus.CANCELLED,
  };

  return statusMap[apiStatus] || FormDispatchStatus.PENDING;
};

// Map Form status back to API status
export const mapFormStatusToApiStatus = (formStatus: FormStatus): ApiStatus => {
  const statusMap: Record<FormStatus, ApiStatus> = {
    [FormDispatchStatus.PENDING]: ApiDispatchStatus.PENDING,
    [FormDispatchStatus.ACCEPTED]: ApiDispatchStatus.DRIVER_ASSIGNED,
    [FormDispatchStatus.IN_PROGRESS]: ApiDispatchStatus.IN_TRANSIT,
    [FormDispatchStatus.COMPLETED]: ApiDispatchStatus.DELIVERED,
    [FormDispatchStatus.CANCELLED]: ApiDispatchStatus.CANCELLED,
  };

  return statusMap[formStatus] || ApiDispatchStatus.PENDING;
};
