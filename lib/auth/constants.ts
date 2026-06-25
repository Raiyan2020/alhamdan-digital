export const ADMIN_SESSION_COOKIE = "admin_session";

export const SESSION_MAX_AGE_SHORT = 60 * 60 * 24; // 1 day
export const SESSION_MAX_AGE_LONG = 60 * 60 * 24 * 30; // 30 days

export type AdminSession = {
  sub: string;
  email: string;
  name: string;
};
