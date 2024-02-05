export type UserId = string;

export type User = {
  email: string;
  fullName: string;
  dateCreated: Date;
  interests?: string[] | null;
  id: UserId;
};
