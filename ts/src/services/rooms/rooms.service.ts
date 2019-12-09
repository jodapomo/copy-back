import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { IRoom, IRoomDTO } from '../../interfaces/room/room.interface';
import { IItem } from '../../interfaces/item/item.interface';
import { ITempUser } from '../../interfaces/user/tempUser.interface';
import config from '../../config';

@Service()
export default class RoomService {
  constructor(@Inject('Room') private room: Model<IRoom>, @Inject('Item') private item: Model<IItem>) {}

  public async createRoomAndLogin(roomDto: IRoomDTO): Promise<{ roomId: number; user: any; token: string }> {
    const tempUser = <ITempUser>{ username: roomDto.username, admin: true };
    let room = new this.room({ name: roomDto.name, password: roomDto.password });

    room.tempUsers.push(tempUser);

    room = await room.save();

    const { user, token } = this.generateToken(room.id, tempUser);
    return { roomId: room.id, user, token };
  }

  private generateToken = (roomId: number, tempUser: ITempUser) => {
    const user = {
      _id: tempUser._id,
      username: tempUser.username,
      lastLogin: tempUser.lastLogin,
      admin: tempUser.admin,
    };

    const token = jwt.sign(
      {
        user,
        roomId,
      },
      config.jwtSecretKey,
      config.jwtOptions,
    );

    return { user, token };
  };
}
