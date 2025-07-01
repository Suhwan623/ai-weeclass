import { ApiProperty } from '@nestjs/swagger';
import { RoomEntity } from '../entities/room.entity';

export class CreateRoomResponseDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: '우울증' })
  name: string;

  @ApiProperty({ example: 7 })
  userId: number;

  constructor(room: RoomEntity) {
    this.id = room.id;
    this.name = room.name;
    this.userId = room.userId;
  }
}
