export type UserCredentials = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: number;
    username: string;
  };
};