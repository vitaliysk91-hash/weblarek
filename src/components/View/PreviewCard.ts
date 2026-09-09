import { Card } from './Card';
import type { IEvents } from '../base/Events';
import type { IPreviewCardView } from '../../types';
import { categoryMap, EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class PreviewCard extends Card<IPreviewCardView> {
  private readonly imageElement: HTMLImageElement;
  private readonly categoryElement: HTMLElement;
  private readonly descriptionElement: HTMLElement;
  private readonly actionButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', container);

    this.actionButton.addEventListener('click', () => {
      events.emit(EVENTS.productAction);
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}
