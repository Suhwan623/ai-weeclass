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