import type { signInType, signUpType } from "../types/auth.type";
import type { CreateMessageType } from "../types/message.type";
import type { CreateRoomType } from "../types/room.type";
import { CommonAPI } from "./common";

export const postWithToken = async (
  accessToken: string | null,
  url: string,
  data: signUpType | signInType | CreateMessageType | CreateRoomType
): Promise<any> => {
  try {
    const response = await CommonAPI.post(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in postWithToken:", error);
    throw error;
  }
};

export const getWithToken = async (
    accessToken: string | null,
    url: string,
): Promise<any> => {
    try {
        const response = await CommonAPI.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        return response.data
    } catch (error) {
        console.error('GET ERROR: ', error);
        throw error;
    }
}

export const patchWithToken = async (
  accessToken: string | null,
  url: string,
  data: Record<string, any> // 수정 시 일반 객체 사용
): Promise<any> => {
  try {
    const response = await CommonAPI.patch(url, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('PATCH ERROR:', error);
    throw error;
  }
};

export const deleteWithToken = async (
  accessToken: string | null,
  url: string
): Promise<any> => {
  try {
    const response = await CommonAPI.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("DELETE ERROR:", error);
    throw error;
  }
};
