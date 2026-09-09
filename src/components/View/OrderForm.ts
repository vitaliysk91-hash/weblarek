import { Form } from './Form';
import type { IEvents } from '../base/Events';
import type {
  IFormChangeEvent,
  IOrderFormView,
  TPayment,
} from '../../types';
import { EVENTS } from '../../utils/constants';
import { ensureAllElements, ensureElement } from '../../utils/utils';

/** Первый шаг оформления заказа: способ оплаты и адрес. */
export class OrderForm extends Form<IOrderFormView> {
  private readonly paymentButtons: HTMLButtonElement[];
  private readonly addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events, EVENTS.orderSubmit);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      '.order__buttons .button',
      container
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      container
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const payment = button.name;
        if (payment === 'card' || payment === 'cash') {
          events.emit<IFormChangeEvent>(EVENTS.formChange, {
            field: 'payment',
            value: payment,
          });
        }
      });
    });
  }

  set payment(value: TPayment | '') {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
