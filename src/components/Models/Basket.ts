import type { IProduct } from '../../types';

/** Модель данных корзины покупателя. */
export class Basket {
  private items: IProduct[] = [];

  /** Возвращает товары, находящиеся в корзине. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Добавляет товар в корзину, если его там ещё нет. */
  addItem(item: IProduct): void {
    if (!this.hasItem(item.id)) {
      this.items.push(item);
    }
  }

  /** Удаляет переданный товар из корзины. */
  removeItem(item: IProduct): void {
    this.items = this.items.filter((basketItem) => basketItem.id !== item.id);
  }

  /** Полностью очищает корзину. */
  clear(): void {
    this.items = [];
  }

  /** Возвращает общую стоимость товаров в корзине. */
  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  /** Возвращает количество товаров в корзине. */
  getCount(): number {
    return this.items.length;
  }

  /** Проверяет наличие товара в корзине по его идентификатору. */
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
