export type CreateRoomType = {
    name: string;
}

export type UpdateRoomType = {
    id: number;
    name: string;
}

export type RoomResponseType = {
    id: number,
    name: string,
    userId: number;
}