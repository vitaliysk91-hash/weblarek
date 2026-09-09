import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IPageView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/** Представление основной страницы: каталог и счётчик корзины. */
export class Page extends Component<IPageView> {
  private readonly gallery: HTMLElement;
  private readonly basketCounter: HTMLElement;
  private readonly basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.gallery = ensureElement<HTMLElement>('.gallery', container);
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

  set catalog(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }

  set basketCount(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
