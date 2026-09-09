import { Card } from './Card';
import type { IEvents } from '../base/Events';
import type { IPreviewCardView, IProductEvent } from '../../types';
import { ensureElement } from '../../utils/utils';

/** Карточка подробного просмотра товара. */
export class PreviewCard extends Card<IPreviewCardView> {
  private readonly actionButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    events: IEvents,
    actionEvent: string,
    productId: string
  ) {
    super(container);
    this.actionButton = ensureElement<HTMLButtonElement>(
      '.card__button',
      container
    );
    this.actionButton.addEventListener('click', () => {
      events.emit<IProductEvent>(actionEvent, { id: productId });
    });
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}
