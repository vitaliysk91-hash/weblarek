import type { IProduct } from '../../types';

/** Модель данных каталога товаров. */
export class Products {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  /** Сохраняет массив товаров в модели. */
  setItems(items: IProduct[]): void {
    this.items = [...items];
  }

  /** Возвращает массив товаров из модели. */
  getItems(): IProduct[] {
    return [...this.items];
  }

  /** Возвращает товар по идентификатору. */
  getItemById(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  /** Сохраняет товар, выбранный для подробного отображения. */
  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  /** Возвращает товар, выбранный для подробного отображения. */
  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}
