import {
  Body,
  Controller,
  UseGuards,
  ValidationPipe,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  HttpCode,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { User } from 'src/decorators/user.decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RoomEntity } from './entities/room.entity';
import { CreateRoomResponseDto } from './dto/create-room-response.dto';

@Controller('/api/room')
@ApiBearerAuth()
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: '방 생성' })
  @ApiBody({ type: CreateRoomDto })
  @ApiResponse({
  status: 201,
  description: '채팅방 생성 완료',
  type: CreateRoomResponseDto,
  })
  async createRoom(
  @Body(ValidationPipe) createRoomDto: CreateRoomDto,
  @User() user: { id: number },
  ): Promise<CreateRoomResponseDto> {
  const room = await this.roomService.createRoom(createRoomDto, user.id);
  return new CreateRoomResponseDto(room);
}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: '내가 만든 채팅방 하나 조회' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        statusCode: 200,
        message: '채팅방 조회 성공',
        data: {
          id: 1,
          name: '우울증 방',
          userId: 6,
        },
      },
    },
  })
  async getOneRoom(
    @Param('id') id: number,
    @User() user
  ): Promise<{ statusCode: number; message: string; data: RoomEntity }> {
    const room = await this.roomService.findOneRoom(id, user.id);
    return {
      statusCode: 200,
      message: '채팅방 조회 성공',
      data: room,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: '내가 만든 채팅방 전체 조회' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        statusCode: 200,
        message: '채팅방 전체 조회 성공',
        data: [
          { id: 1, name: '우울증 방', userId: 6 },
          { id: 2, name: '테스트 방', userId: 6 },
        ],
      },
    },
  })
  async getAllRoom(
    @User() user,
  ): Promise<{ statusCode: number; message: string; data: RoomEntity[] }> {
    const rooms = await this.roomService.findAllRoom(user.id);
    return {
      statusCode: 200,
      message: '채팅방 전체 조회 성공',
      data: rooms,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: '채팅방 이름 수정' })
  @ApiBody({ schema: { example: { name: '대화방' } } })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        statusCode: 200,
        message: '채팅방 수정이 완료되었습니다.',
        data: { id: 1, name: '대화방', userId: 6 },
      },
    },
  })
  async updateRoom(
    @Param('id') id: number,
    @User() user,
    @Body(ValidationPipe) updateRoomDto: UpdateRoomDto,
  ): Promise<{ statusCode: number; message: string; data: RoomEntity }> {
    const updated = await this.roomService.modifyRoom(
      updateRoomDto,
      id,
      user.id,
    );
    return {
      statusCode: 200,
      message: '채팅방 수정이 완료되었습니다.',
      data: updated,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: '내가 만든 채팅방 하나 삭제' })
  @ApiResponse({ status: 204, description: '채팅방 삭제 성공' })
  async deleteRoom(@Param('id') id: number, @User() user): Promise<void> {
    await this.roomService.deleteRoom(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: '내가 만든 채팅방 전체 삭제' })
  @ApiResponse({ status: 204, description: '전체 채팅방 삭제 성공' })
  async deleteAllRoom(@User() user): Promise<void> {
    await this.roomService.deleteAllRooms(user.id);
  }
}
