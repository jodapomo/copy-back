export interface ITempUser {
  _id: string;
  username: string;
  online: string;
  lastLogin: Date;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITempUserDTO {
  username: string;
  admin: boolean;
}
