export const NOTIFICATION_TYPES = [
  'product.deleted',
  'product.updated',
  'wishlist.batch',
  'user.subscription',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
