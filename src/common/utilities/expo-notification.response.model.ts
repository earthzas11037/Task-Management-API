export type ExpoNotificationTooManyExperienceIDSError = {
  code: 'PUSH_TOO_MANY_EXPERIENCE_IDS';
  message: string;
  details: { [slug: string]: string[] };
  isTransient: boolean;
  requestId: string;
};
