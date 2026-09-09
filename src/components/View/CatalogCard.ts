import { Card } from './Card';
import type { IEvents } from '../base/Events';
import type { ICardView, IProductEvent } from '../../types';
import { EVENTS } from '../../utils/constants';

/** Карточка товара в каталоге. */
export class CatalogCard extends Card<ICardView> {
  constructor(container: HTMLElement, events: IEvents, productId: string) {
    super(container);
    this.container.addEventListener('click', () => {
      events.emit<IProductEvent>(EVENTS.cardSelect, { id: productId });
    });
  }
}
