export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

/** Доступные способы оплаты заказа. */
export type TPayment = 'card' | 'cash';

/** Данные товара, получаемые из каталога. */
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

/** Данные покупателя, заполняемые при оформлении заказа. */
export interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}

/** Ошибки валидации отдельных полей покупателя. */
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

/** Ответ сервера со списком товаров. */
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

/** Данные заказа, отправляемые на сервер. */
export interface IOrder extends Omit<IBuyer, 'payment'> {
  payment: TPayment;
  total: number;
  items: string[];
}

/** Ответ сервера после успешного оформления заказа. */
export interface IOrderResult {
  id: string;
  total: number;
}
