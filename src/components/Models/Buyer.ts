import type { IBuyer, TBuyerErrors } from '../../types';
import type { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

const EMPTY_BUYER: IBuyer = {
  payment: '',
  email: '',
  phone: '',
  address: '',
};

export class Buyer {
  private data: IBuyer = { ...EMPTY_BUYER };

  constructor(private readonly events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...data,
    };
    this.events.emit(EVENTS.buyerChanged);
  }

  getData(): IBuyer {
    return { ...this.data };
  }

   clear(): void {
    this.data = { ...EMPTY_BUYER };
    this.events.emit(EVENTS.buyerChanged);
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.data.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.data.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.data.email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this.data.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }
}
