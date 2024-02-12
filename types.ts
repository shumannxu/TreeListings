export type UserId = string;

export type User = {
  email: string;
  fullName: string;
  dateCreated: Date;
  interests?: string[] | null;
  id: UserId;
};

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
