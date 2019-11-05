import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import { Model, Document } from 'mongoose';
import { IRoom } from '../../interfaces/room/room.interface';

@Service()
export default class RoomService {
  // constructor(@Inject('Room') private room: Model<IRoom & Document>) {}
  constructor(@Inject('Room') private room: Model<IRoom>) {}

  // public async login(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {}
  public async getRooms() {
    const rooms = await this.room.find();
    return rooms;
  }
}
