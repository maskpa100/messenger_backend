export type Messengers = {
  id: number;
  time: Date;
  from_user: number;
  to_user: number;
  message: string;
  delivered: boolean;
};

export type User = {
  id: number;
  email: string;
  family: string | null;
  name: string | null;
  avatar: string | null;
  time: Date | null;
};
