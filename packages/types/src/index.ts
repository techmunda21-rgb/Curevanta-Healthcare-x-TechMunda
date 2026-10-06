export {
  BOOKING_STATUSES,
  type BookingStatus,
  type ServiceKind,
  type BookingSummary,
} from "./booking";

export type ApiErrorBody = {
  code: string;
  message: string;
  requestId?: string;
};
