import { useMutation, useQuery } from '@tanstack/react-query';
import { getCookie } from '../utils';
import { deleteWithToken, getWithToken, patchWithToken, postWithToken } from '../api';
import type { CreateRoomType, RoomResponseType, UpdateRoomType } from '../types/room.type';
import { AxiosError } from 'axios';
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

  const updateRoom = useMutation<RoomResponseType, AxiosError, UpdateRoomType>({
    mutationFn: async (data: UpdateRoomType) => {
      const accessToken = getCookie('accessToken');
      const response = await patchWithToken(accessToken, `/room/${data.id}`, { name: data.name });
      return response as RoomResponseType;
    },
    onSuccess: () => {
      getRooms.refetch();
    },
  });

  const deleteRoom = useMutation<void, AxiosError, number>({
    mutationFn: async (roomId: number) => {
      const accessToken = getCookie('accessToken');
      await deleteWithToken(accessToken, `/room/${roomId}`);
    },
    onSuccess: () => {
      getRooms.refetch();
    },
  });
  

  return {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom
  };
};