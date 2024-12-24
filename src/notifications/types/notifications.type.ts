export const NOTIFICATION_TYPES = [
  'product_deleted',
  'product_update',
  'wishlist_batch',
  'user_subscription',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
