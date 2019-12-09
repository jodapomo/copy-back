import { Controller, Get, Req, Res, Authorized, Post, Body } from 'routing-controllers';
import RoomService from '../../../services/rooms/rooms.service';
import { Request, Response } from 'express';
import { ApiError } from '../../errors/apiError';
import { IRoomDTO } from '../../../interfaces/room/room.interface';

@Controller('/rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Post('/login')
  async createRoomAndLogin(@Body() roomDto: IRoomDTO, @Res() res: Response) {
    const responseInfo = await this.roomService.createRoomAndLogin(roomDto);

    return res.status(200).json({
      ok: true,
      code: 200,
      ...responseInfo,
    });
  }
}
