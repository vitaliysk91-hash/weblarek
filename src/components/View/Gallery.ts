import { Component } from '../base/Component';
import type { IGalleryView } from '../../types';

/** Представление каталога товаров. */
export class Gallery extends Component<IGalleryView> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
