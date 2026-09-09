import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(private readonly events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.events.emit(EVENTS.productsChanged);
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

    getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
    this.events.emit(EVENTS.productSelected);
  }


  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
