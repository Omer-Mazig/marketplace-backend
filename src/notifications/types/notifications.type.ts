export const NOTIFICATION_TYPES = [
  'product_deleted',
  'product_updated',
  'wishlist_batch',
  'user_subscription',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
