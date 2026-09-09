# Проектная работа «Веб-ларёк»

Репозиторий: https://github.com/vitaliysk91-hash/weblarek

«Веб-ларёк» — интернет-магазин товаров для веб-разработчиков. Пользователь может посмотреть каталог, открыть карточку товара, добавить товар в корзину, оформить заказ и отправить его на сервер.

Стек проекта: **HTML, SCSS, TypeScript, Vite**.

## Установка и запуск

Установить зависимости:

```bash
npm install
```

Создать в корне проекта файл `.env`:

```env
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

Запустить проект в режиме разработки:

```bash
npm run dev
```

Собрать проект:

```bash
npm run build
```

## Структура проекта

Основные файлы и папки:

- `src/components/base/` — базовые классы `Component`, `Api`, `EventEmitter`;
- `src/components/Models/` — модели данных `Products`, `Basket`, `Buyer`;
- `src/components/View/` — классы представления;
- `src/components/Api/` — класс `LarekApi` для работы с сервером;
- `src/types/index.ts` — типы и интерфейсы;
- `src/utils/` — константы и вспомогательные функции;
- `src/main.ts` — Presenter и связывание всех частей приложения;
- `src/scss/`, `src/common.blocks/` — стили;
- `index.html` — основная разметка и HTML-шаблоны.

# Архитектура

Проект построен по паттерну **MVP (Model–View–Presenter)**.

**Model** хранит данные приложения и изменяет их. Модели не работают с DOM и не выполняют HTTP-запросы. После изменения данных модель сообщает об этом через событие.

**View** отвечает за отображение. Компоненты представления работают только со своей частью DOM и сообщают о действиях пользователя через события. Бизнес-данные во View не хранятся.

**Presenter** находится в `src/main.ts`. Он подписывается на события моделей и представлений, получает данные из моделей и передаёт подготовленные данные компонентам View.

Для связи компонентов используется один экземпляр `EventEmitter`.

# Базовые классы

## `Component<T>`

Абстрактный базовый класс для компонентов представления.

### Конструктор

```ts
constructor(container: HTMLElement)
```

`container` — корневой DOM-элемент компонента.

### Поля

- `container: HTMLElement` — основной элемент компонента.

### Методы

- `render(data?: Partial<T>): HTMLElement` — передаёт данные в компонент и возвращает его разметку;
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение и `alt`.

## `Api`

Базовый класс для HTTP-запросов.

### Конструктор

```ts
constructor(baseUrl: string, options: RequestInit = {})
```

### Поля

- `baseUrl: string` — базовый адрес сервера;
- `options: RequestInit` — общие параметры запросов.

### Методы

- `get<T extends object>(uri: string): Promise<T>` — GET-запрос;
- `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — POST, PUT или DELETE;
- `handleResponse<T>(response: Response): Promise<T>` — обработка ответа сервера.

## `EventEmitter`

Брокер событий. Используется для связи моделей, представлений и Presenter.

### Методы

- `on<T extends object>(eventName, callback): void` — подписка на событие;
- `off(eventName, callback): void` — удаление подписки;
- `emit<T extends object>(eventName, data?): void` — генерация события;
- `onAll(callback): void` — подписка на все события;
- `offAll(): void` — удаление всех подписок;
- `trigger<T extends object>(eventName, context?): (data: T) => void` — создаёт обработчик, который генерирует событие.

# Типы данных

Все типы находятся в `src/types/index.ts`.

## API

```ts
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}
```

`IApi` используется как зависимость коммуникационного класса `LarekApi`.

## Товар

```ts
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

`price: null` означает, что товар нельзя купить.

## Покупатель

```ts
export type TPayment = 'card' | 'cash';

export interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}
```

Пустая строка в `payment` используется до выбора способа оплаты.

Ошибки проверки полей:

```ts
export type TBuyerErrors =
  Partial<Record<keyof IBuyer, string>>;
```

## Ответ каталога

```ts
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}
```

## Заказ

```ts
export interface IOrder extends Omit<IBuyer, 'payment'> {
  payment: TPayment;
  total: number;
  items: string[];
}
```

В `items` передаются id выбранных товаров.

Ответ сервера после оформления:

```ts
export interface IOrderResult {
  id: string;
  total: number;
}
```

## Типы View

Для компонентов представления используются отдельные интерфейсы:

- `IPageView` — каталог и счётчик корзины;
- `ICardView` — общие для всех карточек данные: название и цена;
- `ICatalogCardView` — изображение и категория карточки каталога;
- `IPreviewCardView` — данные подробной карточки и состояние кнопки;
- `IBasketCardView` — данные карточки в корзине;
- `IBasketView` — список товаров, сумма и состояние кнопки оформления;
- `IFormView` — валидность формы и ошибки;
- `IOrderFormView` — данные первого шага оформления;
- `IContactsFormView` — данные второго шага;
- `ISuccessView` — сумма успешного заказа;
- `IProductEvent` — id товара в событии;
- `IFormChangeEvent` — имя изменённого поля и новое значение.

# Модели данных

## `Products`

Хранит каталог товаров и товар, выбранный для подробного просмотра.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

- `items: IProduct[]` — каталог;
- `selectedItem: IProduct | null` — выбранный товар;
- `events: IEvents` — брокер событий.

### Методы

- `setItems(items: IProduct[]): void` — сохраняет каталог;
- `getItems(): IProduct[]` — возвращает товары;
- `getItemById(id: string): IProduct | undefined` — ищет товар по id;
- `setSelectedItem(item: IProduct): void` — сохраняет выбранный товар;
- `getSelectedItem(): IProduct | null` — возвращает выбранный товар.

При изменении каталога генерируется `products:changed`, при изменении выбранного товара — `product:selected`.

## `Basket`

Хранит товары, добавленные в корзину.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

- `items: IProduct[]` — товары корзины;
- `events: IEvents` — брокер событий.

### Методы

- `getItems(): IProduct[]` — возвращает товары корзины;
- `addItem(item: IProduct): void` — добавляет товар;
- `removeItem(item: IProduct): void` — удаляет товар;
- `clear(): void` — очищает корзину;
- `getTotal(): number` — считает итоговую стоимость;
- `getCount(): number` — возвращает количество товаров;
- `hasItem(id: string): boolean` — проверяет наличие товара по id.

При изменении корзины генерируется событие `basket:changed`.

## `Buyer`

Хранит данные покупателя и проверяет заполнение полей.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

- `data: IBuyer` — текущие данные покупателя;
- `events: IEvents` — брокер событий.

### Методы

- `setData(data: Partial<IBuyer>): void` — обновляет переданные поля;
- `getData(): IBuyer` — возвращает данные покупателя;
- `clear(): void` — очищает данные;
- `validate(): TBuyerErrors` — возвращает ошибки незаполненных полей.

После изменения данных генерируется `buyer:changed`.

# Слой представления

Все элементы DOM, с которыми работает компонент, находятся в его конструкторе и сохраняются в полях. Слушатели событий также устанавливаются один раз в конструкторе.

## `Page`

Отвечает за главную страницу: каталог и счётчик корзины.

### Конструктор

```ts
constructor(container: HTMLElement, events: IEvents)
```

### Поля

- `gallery: HTMLElement` — контейнер каталога;
- `basketCounter: HTMLElement` — счётчик;
- `basketButton: HTMLButtonElement` — кнопка корзины.

### Интерфейс

- `catalog` — заменяет содержимое каталога;
- `basketCount` — обновляет счётчик.

Клик по корзине генерирует `basket:open`.

## `Modal`

Управляет общим модальным окном.

### Конструктор

```ts
constructor(container: HTMLElement, events: IEvents)
```

### Поля

- `closeButton: HTMLButtonElement` — кнопка закрытия;
- `contentElement: HTMLElement` — контейнер содержимого.

### Методы

- `content` — устанавливает содержимое;
- `open(): void` — открывает окно;
- `close(): void` — закрывает окно и очищает содержимое.

Закрытие по крестику или оверлею генерирует `modal:close`.

## `Card<T>`

Абстрактный родитель всех вариантов карточки.

### Конструктор

```ts
constructor(container: HTMLElement)
```

### Поля

- `titleElement: HTMLElement` — название товара;
- `priceElement: HTMLElement` — цена.

Базовый класс содержит только поля, которые есть во всех трёх вариантах карточки. Через сеттеры `title` и `price` обновляет общую часть разметки.

## `CatalogCard`

Карточка товара в каталоге. Наследуется от `Card<ICatalogCardView>`.

### Конструктор

```ts
constructor(
  container: HTMLElement,
  events: IEvents,
  productId: string
)
```

### Поля

- `imageElement: HTMLImageElement` — изображение;
- `categoryElement: HTMLElement` — категория.

Сеттеры `image` и `category` обновляют данные, которые есть только у карточек каталога. Клик по карточке генерирует `card:select`.

## `PreviewCard`

Карточка подробного просмотра. Наследуется от `Card<IPreviewCardView>`.

### Конструктор

```ts
constructor(container: HTMLElement, events: IEvents)
```

Компонент создаётся один раз и переиспользуется для разных товаров. Выбранный товар хранится в модели `Products`, поэтому `PreviewCard` не хранит его id.

### Поля

- `imageElement: HTMLImageElement` — изображение;
- `categoryElement: HTMLElement` — категория;
- `descriptionElement: HTMLElement` — описание;
- `actionButton: HTMLButtonElement` — кнопка действия.

### Интерфейс

- `image` — изображение товара;
- `category` — категория;
- `description` — описание;
- `buttonText` — текст кнопки;
- `buttonDisabled` — состояние `disabled`.

Клик по кнопке генерирует `product:action`. Presenter получает выбранный товар из модели и решает, добавить его в корзину или удалить.

## `BasketCard`

Карточка товара в корзине. Наследуется от `Card<IBasketCardView>`.

### Конструктор

```ts
constructor(
  container: HTMLElement,
  events: IEvents,
  productId: string
)
```

### Поля

- `indexElement: HTMLElement` — номер товара;
- `deleteButton: HTMLButtonElement` — кнопка удаления.

Сеттер `index` устанавливает номер позиции. Удаление генерирует `basket:remove`.

## `BasketView`

Отображает содержимое корзины.

### Конструктор

```ts
constructor(container: HTMLElement, events: IEvents)
```

### Поля

- `listElement: HTMLElement` — список;
- `totalElement: HTMLElement` — сумма;
- `orderButton: HTMLButtonElement` — кнопка оформления.

### Интерфейс

- `items` — карточки товаров;
- `total` — итоговая стоимость;
- `valid` — доступность кнопки оформления.

Клик по кнопке генерирует `order:open`.

## `Form<T>`

Абстрактный родитель форм оформления.

### Конструктор

```ts
constructor(
  container: HTMLFormElement,
  events: IEvents,
  submitEvent: string
)
```

### Поля

- `submitButton: HTMLButtonElement` — кнопка отправки;
- `errorsElement: HTMLElement` — контейнер ошибок.

### Интерфейс

- `valid` — управляет доступностью submit-кнопки;
- `errors` — выводит ошибки.

Изменение поля генерирует `form:change`, отправка формы — событие, переданное в `submitEvent`.

## `OrderForm`

Первый шаг оформления заказа. Наследуется от `Form<IOrderFormView>`.

### Конструктор

```ts
constructor(container: HTMLFormElement, events: IEvents)
```

### Поля

- `paymentButtons: HTMLButtonElement[]` — способы оплаты;
- `addressInput: HTMLInputElement` — адрес.

### Интерфейс

- `payment` — выбранный способ оплаты;
- `address` — адрес доставки.

Выбранная кнопка оплаты получает класс `button_alt-active`.

Submit генерирует `order:submit`.

## `ContactsForm`

Второй шаг оформления. Наследуется от `Form<IContactsFormView>`.

### Конструктор

```ts
constructor(container: HTMLFormElement, events: IEvents)
```

### Поля

- `emailInput: HTMLInputElement`;
- `phoneInput: HTMLInputElement`.

### Интерфейс

- `email` — почта;
- `phone` — телефон.

Submit генерирует `contacts:submit`.

## `Success`

Показывает результат успешного заказа.

### Конструктор

```ts
constructor(container: HTMLElement, events: IEvents)
```

### Поля

- `descriptionElement: HTMLElement` — текст с суммой;
- `closeButton: HTMLButtonElement` — кнопка закрытия.

Сеттер `total` устанавливает сумму заказа. Кнопка закрытия генерирует `success:close`.

# Работа с сервером

## `LarekApi`

Класс предметного API. Использует базовый `Api` через композицию.

### Конструктор

```ts
constructor(api: IApi)
```

### Поля

- `api: IApi` — объект для выполнения запросов.

### Методы

```ts
getProducts(): Promise<IProductsResponse>
```

Получает каталог через `GET /product/`.

```ts
createOrder(order: IOrder): Promise<IOrderResult>
```

Отправляет заказ через `POST /order/`.

# События

Имена событий находятся в `EVENTS` в `src/utils/constants.ts`.

## События моделей

- `products:changed` — изменился каталог;
- `product:selected` — изменился выбранный товар;
- `basket:changed` — изменилась корзина;
- `buyer:changed` — изменились данные покупателя.

## События представлений

- `card:select` — выбрана карточка каталога;
- `product:action` — нажатие основной кнопки подробной карточки;
- `basket:open` — открытие корзины;
- `basket:remove` — удаление товара из корзины;
- `order:open` — переход к оформлению;
- `form:change` — изменение поля формы;
- `order:submit` — переход ко второму шагу;
- `contacts:submit` — отправка заказа;
- `modal:close` — закрытие модального окна;
- `success:close` — закрытие окна успешного заказа.

# Presenter

Presenter реализован в `src/main.ts`.

Основная логика приложения:

1. Один раз создаются `Page`, `Modal`, `BasketView`, `PreviewCard`, `OrderForm`, `ContactsForm` и `Success`. Карточки каталога и корзины создаются по количеству товаров при обновлении соответствующих моделей.
2. Каталог загружается с сервера и сохраняется в `Products`.
3. Только в обработчике `products:changed` перерисовывается каталог.
4. При выборе карточки товар сохраняется как выбранный. Только в обработчике `product:selected` обновляется и открывается `PreviewCard`.
5. `product:action` меняет только модель корзины. Состояние корзины и счётчик перерисовываются в `basket:changed`.
6. События открытия корзины и форм только помещают уже созданный компонент в `Modal`; повторного рендера данных в этих обработчиках нет.
7. Изменения полей сохраняются в `Buyer`. Обе формы получают новое состояние только в `buyer:changed`.
8. После корректного первого шага открывается уже созданная форма контактов.
9. После второго шага Presenter собирает `IOrder` и отправляет его через `LarekApi`.
10. После успешного заказа показывается `Success`, затем очищаются `Basket` и `Buyer`, что приводит к обновлению связанных представлений через события моделей.

Presenter не генерирует события. Он обрабатывает события и связывает Model и View.
