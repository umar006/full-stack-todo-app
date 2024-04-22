import type { User } from "./user";

export interface RegisterForm {
  username: string;
  password: string;
}

export interface RegisterResponse {
  user: Omit<User, "password">;
}
