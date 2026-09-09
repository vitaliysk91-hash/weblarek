import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface IModalView {
  content: HTMLElement;
}

/** Универсальное модальное окно для отображения самостоятельных компонентов. */
export class Modal extends Component<IModalView> {
  private readonly closeButton: HTMLButtonElement;
  private readonly contentElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      container
    );
    this.contentElement = ensureElement<HTMLElement>(
      '.modal__content',
      container
    );

    this.closeButton.addEventListener('click', () => {
      events.emit(EVENTS.modalClose);
    });

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        events.emit(EVENTS.modalClose);
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
  }
}
