import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Basket {
  private items: IProduct[] = [];

  constructor(private readonly events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(item: IProduct): void {
    if (this.hasItem(item.id)) {
      return;
    }

    this.items.push(item);
    this.events.emit(EVENTS.basketChanged);
  }

  removeItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      return;
    }

    this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
    this.events.emit(EVENTS.basketChanged);
  }

  clear(): void {
    if (this.items.length === 0) {
      return;
    }

    this.items = [];
    this.events.emit(EVENTS.basketChanged);
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
