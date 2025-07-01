import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options?: any) => {
  return cookies.set(name, value, {
    ...options,
    httpOnly: false,
    path: '/',
    sameSite: 'strict',
    maxAge: 60 * 40, // 40분
  });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const deleteCookie = (name: string, options?: any) => {
  return cookies.remove(name, { ...options });
};
