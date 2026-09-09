import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { ISuccessView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { formatPrice } from '../../utils/format';
import { ensureElement } from '../../utils/utils';

/** Представление успешного оформления заказа. */
export class Success extends Component<ISuccessView> {
  private readonly descriptionElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      '.order-success__description',
      container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      container
    );

    this.closeButton.addEventListener('click', () => {
      events.emit(EVENTS.successClose);
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${formatPrice(value)}`;
  }
}
