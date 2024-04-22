import type {
  LoginForm,
  LoginResponse,
  RegisterForm,
  RegisterResponse,
} from "../types/auth";

const BASE_URL = "/api/auth";

export const login = async (login: LoginForm): Promise<LoginResponse> => {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login),
  }).then((res) => res.json());

  return res;
};

export const register = async (
  register: RegisterForm,
): Promise<RegisterResponse> => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(register),
  }).then((res) => res.json());

  return res;
};
