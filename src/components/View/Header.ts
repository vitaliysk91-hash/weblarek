import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IHeaderView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/** Представление шапки страницы и состояния корзины. */
export class Header extends Component<IHeaderView> {
  private readonly basketCounter: HTMLElement;
  private readonly basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.basketCounter = ensureElement<HTMLElement>(
      '.header__basket-counter',
      container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      '.header__basket',
      container
    );

    this.basketButton.addEventListener('click', () => {
      events.emit(EVENTS.basketOpen);
    });
  }

  set basketCount(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
