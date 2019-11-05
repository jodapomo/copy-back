import { IItem, IItemDTO } from '../item.interface';

export interface ITextItem extends IItem {
  content: string;
}

export interface ITextItemDTO extends IItemDTO {
  content: string;
}
