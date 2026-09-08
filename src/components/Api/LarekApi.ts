import type {
  IApi,
  IOrder,
  IOrderResult,
  IProductsResponse,
} from '../../types';

/** Коммуникационный слой приложения для работы с API Web-Larёk. */
export class LarekApi {
  constructor(private readonly api: IApi) {}

  /** Получает каталог товаров с сервера. */
  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/');
  }

  /** Отправляет заказ на сервер и возвращает результат оформления. */
  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>('/order/', order);
  }
}
