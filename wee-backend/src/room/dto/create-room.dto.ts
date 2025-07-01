import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @ApiProperty({ example: '우울증 방', description: '채팅방 이름' })
  @IsNotEmpty( {message: '방이름을 입력해주세요.'})
  name: string
}
