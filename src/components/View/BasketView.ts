import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IBasketView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { formatPrice } from '../../utils/format';
import { ensureElement } from '../../utils/utils';

/** Представление корзины. */
export class BasketView extends Component<IBasketView> {
  private readonly listElement: HTMLElement;
  private readonly totalElement: HTMLElement;
  private readonly orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.listElement = ensureElement<HTMLElement>('.basket__list', container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      '.basket__button',
      container
    );

    this.orderButton.addEventListener('click', () => {
      events.emit(EVENTS.orderOpen);
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalElement.textContent = formatPrice(value);
  }

  set valid(value: boolean) {
    this.orderButton.disabled = !value;
  }
}
