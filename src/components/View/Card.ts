import { Component } from '../base/Component';
import type { ICardView } from '../../types';
import { categoryMap } from '../../utils/constants';
import { formatPrice } from '../../utils/format';
import { ensureElement } from '../../utils/utils';

/** Базовое представление карточки товара. */
export abstract class Card<T extends ICardView = ICardView> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;
  protected readonly imageElement: HTMLImageElement | null;
  protected readonly categoryElement: HTMLElement | null;
  protected readonly descriptionElement: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    this.imageElement = container.querySelector<HTMLImageElement>('.card__image');
    this.categoryElement = container.querySelector<HTMLElement>('.card__category');
    this.descriptionElement = container.querySelector<HTMLElement>('.card__text');
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = formatPrice(value);
  }

  set image(value: string | undefined) {
    if (this.imageElement && value) {
      this.setImage(this.imageElement, value, this.titleElement.textContent ?? '');
    }
  }

  set category(value: string | undefined) {
    if (!this.categoryElement || !value) {
      return;
    }

    Object.values(categoryMap).forEach((className) => {
      this.categoryElement?.classList.remove(className);
    });

    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
    this.categoryElement.textContent = value;
  }

  set description(value: string | undefined) {
    if (this.descriptionElement && value !== undefined) {
      this.descriptionElement.textContent = value;
    }
  }
}
