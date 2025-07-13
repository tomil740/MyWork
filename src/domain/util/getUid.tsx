import type { User } from "../models/User";

export function getUid(user: User | null): string | null {
  if (!user) return null;
  return user.theUid || user.uid;
}
