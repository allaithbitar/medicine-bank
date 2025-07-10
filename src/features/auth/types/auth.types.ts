export interface IUser {
  id: number;
  username: string;
  email: string;
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
}
