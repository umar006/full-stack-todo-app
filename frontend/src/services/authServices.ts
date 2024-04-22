import type { RegisterForm, RegisterResponse } from "../types/auth";

const BASE_URL = "/api/auth";


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
