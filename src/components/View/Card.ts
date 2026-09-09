import { Component } from '../base/Component';
import type { ICardView } from '../../types';
import { formatPrice } from '../../utils/format';
import { ensureElement } from '../../utils/utils';

export abstract class Card<T extends ICardView = ICardView> extends Component<T> {
  protected readonly titleElement: HTMLElement;
  protected readonly priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = formatPrice(value);
  }
}
