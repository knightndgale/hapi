export enum Roles {
  Administrator = "Administrator",
  User = "User",
}

export type Role = keyof typeof Roles;
