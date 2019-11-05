export interface ITokenDecoded {
  user: {
    _id: string;
    username: string;
    lastLogin: Date;
    admin: boolean;
  };
  roomId: number;
  iat: number;
  exp: number;
}
