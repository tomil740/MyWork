export interface User {
  name: string;
  uid: string;
  theUid: string;
}
export interface AuthUser extends User {
  syncedAt?: number; // Timestamp for sync
}
