/** Форматирует стоимость товара в единицах интерфейса Web-ларька. */
export function formatPrice(price: number | null): string {
  return price === null ? 'Бесценно' : `${price} синапсов`;
}
