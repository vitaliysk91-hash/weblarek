import { Card } from './Card';
import type { IEvents } from '../base/Events';
import type { ICatalogCardView, IProductEvent } from '../../types';
import { categoryMap, EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CatalogCard extends Card<ICatalogCardView> {
  private readonly imageElement: HTMLImageElement;
  private readonly categoryElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents, productId: string) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);

    this.container.addEventListener('click', () => {
      events.emit<IProductEvent>(EVENTS.cardSelect, { id: productId });
    });
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent ?? '');
  }

  set category(value: string) {
    Object.values(categoryMap).forEach((className) => {
      this.categoryElement.classList.remove(className);
    });

    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }

    this.categoryElement.textContent = value;
  }
}
