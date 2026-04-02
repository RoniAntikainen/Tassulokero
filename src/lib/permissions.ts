import type { UserRole } from "../types/domain";

export type ViewerRole = UserRole | "breeder";

export function canManagePets(role: ViewerRole) {
  return role === "owner";
}

export function canManageHealth(role: ViewerRole) {
  return role === "owner" || role === "family";
}

export function canManageCare(role: ViewerRole) {
  return role === "owner" || role === "family";
}

export function canManageReminders(role: ViewerRole) {
  return role === "owner" || role === "family";
}

export function canViewReminders(role: ViewerRole) {
  return role === "owner" || role === "family";
}

export function canManageHeat(role: ViewerRole) {
  return role === "owner" || role === "family" || role === "breeder";
}

export function canManagePetProfile(role: ViewerRole) {
  return role === "owner" || role === "family";
}

export function canCreateUpdates(role: ViewerRole) {
  return role !== "breeder";
}

export function getUpdateAuthorRole(role: ViewerRole): UserRole {
  if (role === "family") {
    return "family";
  }

  if (role === "caretaker") {
    return "caretaker";
  }

  return "owner";
}

export function canManageSharing(role: ViewerRole, hasFamilyAdminAccess: boolean) {
  return role === "owner" || (role === "family" && hasFamilyAdminAccess);
}
