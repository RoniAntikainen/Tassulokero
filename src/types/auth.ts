export type AuthMode = "sign-in" | "sign-up" | "reset-password";
export type RoleProfile = "owner" | "breeder";

export interface AuthFormValues {
  displayName: string;
  email: string;
  password: string;
  roleProfile: RoleProfile;
}

export interface SessionUser {
  id: string;
  dbUserId?: string;
  displayName: string;
  email: string;
  roleProfile: RoleProfile;
}
