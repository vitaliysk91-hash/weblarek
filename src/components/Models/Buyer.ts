import type { IBuyer, TBuyerErrors } from '../../types';

const EMPTY_BUYER: IBuyer = {
  payment: '',
  email: '',
  phone: '',
  address: '',
};

/** Модель данных покупателя. */
export class Buyer {
  private data: IBuyer = { ...EMPTY_BUYER };

  /** Частично обновляет данные покупателя, не стирая остальные поля. */
  setData(data: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  /** Возвращает все сохранённые данные покупателя. */
  getData(): IBuyer {
    return { ...this.data };
  }

  /** Очищает данные покупателя. */
  clear(): void {
    this.data = { ...EMPTY_BUYER };
  }

  /** Проверяет заполненность всех полей и возвращает объект ошибок. */
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
