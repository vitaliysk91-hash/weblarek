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

/** Данные, отображаемые компонентом страницы. */
export interface IPageView {
  catalog: HTMLElement[];
  basketCount: number;
}

export interface ICardView {
  title: string;
  price: number | null;
}

export interface ICatalogCardView extends ICardView {
  category: string;
  image: string;
}

export interface IPreviewCardView extends ICatalogCardView {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

/** Данные карточки товара в корзине. */
export interface IBasketCardView extends ICardView {
  index: number;
}

/** Данные компонента корзины. */
export interface IBasketView {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}

/** Общие данные состояния формы. */
export interface IFormView {
  valid: boolean;
  errors: string[];
}

/** Данные формы выбора оплаты и адреса. */
export interface IOrderFormView extends IFormView {
  payment: TPayment | '';
  address: string;
}

/** Данные формы контактов. */
export interface IContactsFormView extends IFormView {
  email: string;
  phone: string;
}

/** Данные экрана успешного заказа. */
export interface ISuccessView {
  total: number;
}

/** Данные события, связанного с конкретным товаром. */
export interface IProductEvent {
  id: string;
}

/** Данные события изменения поля формы. */
export interface IFormChangeEvent {
  field: keyof IBuyer;
  value: string;
}
