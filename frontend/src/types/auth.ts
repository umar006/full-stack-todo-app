import type { User } from "./user";

export interface RegisterForm {
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: Omit<User, "password">;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, "password">;
  token: string;
}
