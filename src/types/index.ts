export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends Omit<IBuyer, 'payment'> {
  payment: TPayment;
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IPageView {
  catalog: HTMLElement[];
  basketCount: number;
}

export interface ICardView {
  title: string;
  price: number | null;
  category?: string;
  image?: string;
  description?: string;
}

export interface IPreviewCardView extends ICardView {
  buttonText: string;
  buttonDisabled: boolean;
}

export interface IBasketCardView extends ICardView {
  index: number;
}

export interface IBasketView {
  items: HTMLElement[];
  total: number;
  valid: boolean;
}

export interface IFormView {
  valid: boolean;
  errors: string[];
}

export interface IOrderFormView extends IFormView {
  payment: TPayment | '';
  address: string;
}

export interface IContactsFormView extends IFormView {
  email: string;
  phone: string;
}

export interface ISuccessView {
  total: number;
}

export interface IProductEvent {
  id: string;
}

export interface IFormChangeEvent {
  field: keyof IBuyer;
  value: string;
}
