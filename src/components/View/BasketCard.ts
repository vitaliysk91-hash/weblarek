import { Card } from './Card';
import type { IEvents } from '../base/Events';
import type { IBasketCardView, IProductEvent } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/** Компактная карточка товара в корзине. */
export class BasketCard extends Card<IBasketCardView> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents, productId: string) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index',
      container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      container
    );
    this.deleteButton.addEventListener('click', () => {
      events.emit<IProductEvent>(EVENTS.basketRemove, { id: productId });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
