import { IItem, IItemDTO } from '../item.interface';

export interface ILinkItem extends IItem {
  link: string;
  title: string;
  description: string;
  image: string;
}

export interface ILinkItemDTO extends IItemDTO {
  link: string;
  title: string;
  description: string;
  image: string;
}
