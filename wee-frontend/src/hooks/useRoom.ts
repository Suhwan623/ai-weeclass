import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie } from '../utils';
import { getWithToken, postWithToken } from '../api';
import type { CreateRoomType, RoomResponseType } from '../types/room.type';
import type { AxiosError } from 'axios';

export const useRoom = () => {
  const accessToken = getCookie('accessToken');

  const getRooms = useQuery<RoomResponseType[], AxiosError>({
    queryKey: ['rooms'],
    queryFn: async () => {
      const response = await getWithToken(accessToken, '/room');
      return response.data as RoomResponseType[] || [];
    },
    enabled: !!accessToken,
    refetchOnWindowFocus: true,
  });

  const createRoom = useMutation<RoomResponseType, AxiosError, CreateRoomType>({
    mutationFn: async (data: CreateRoomType) => {
      const response = await postWithToken(accessToken, '/room', data);
      return response as RoomResponseType;
    },
    onSuccess: () => {
      getRooms.refetch();
    },
  });

  return {
    getRooms,
    createRoom,
  };
};