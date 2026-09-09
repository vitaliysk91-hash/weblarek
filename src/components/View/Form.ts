import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IFormChangeEvent, IFormView } from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

/** Базовое представление формы оформления заказа. */
export abstract class Form<T extends IFormView> extends Component<T> {
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;

  constructor(
    container: HTMLFormElement,
    events: IEvents,
    submitEvent: string
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container
    );
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

    this.container.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      events.emit<IFormChangeEvent>(EVENTS.formChange, {
        field: target.name as IFormChangeEvent['field'],
        value: target.value,
      });
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      events.emit(submitEvent);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string[]) {
    this.errorsElement.textContent = value.join('; ');
  }
}
