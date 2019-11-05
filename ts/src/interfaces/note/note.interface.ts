export interface INote {
  _id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INoteDTO {
  content: string;
}
