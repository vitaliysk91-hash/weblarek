# Проектная работа «Веб-ларёк»

https://github.com/vitaliysk91-hash/weblarek

Стек: HTML, SCSS, TypeScript, Vite.

«Веб-ларёк» — интернет-магазин товаров для веб-разработчиков. Пользователь может просматривать каталог и подробную информацию о товарах, добавлять и удалять товары из корзины, заполнять данные заказа и отправлять заказ на сервер.

Проект построен по архитектурному паттерну MVP и использует событийную модель для связи независимых слоёв приложения.

## Структура проекта

- `src/components/base/` — базовые классы `Component`, `Api`, `EventEmitter`;
- `src/components/Models/` — модели данных `Products`, `Basket`, `Buyer`;
- `src/components/View/` — компоненты слоя представления;
- `src/components/Api/` — коммуникационный класс `LarekApi`;
- `src/types/index.ts` — типы и интерфейсы приложения;
- `src/utils/` — константы и вспомогательные функции;
- `src/main.ts` — Presenter и сборка всех слоёв приложения;
- `src/scss/` и `src/common.blocks/` — стили;
- `index.html` — основная разметка и HTML-шаблоны.

## Установка и запуск

Установить зависимости:

```bash
npm install
```

Создать в корне проекта файл `.env`:

```env
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

Запустить проект:

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

# Архитектура приложения

В проекте используется паттерн **MVP (Model-View-Presenter)**.

- **Model** хранит и изменяет данные приложения. Модели не работают с DOM и API. После изменения данных модель генерирует событие.
- **View** отвечает только за отображение состояния интерфейса и уведомляет о действиях пользователя событиями. Компоненты представления не хранят бизнес-данные и не принимают решения о сценариях приложения.
- **Presenter** реализован в `src/main.ts`. Он подписывается на события моделей и представлений, получает данные из моделей, подготавливает данные для View и вызывает методы других слоёв. Presenter сам события не генерирует.

Связь между слоями реализована через единый экземпляр `EventEmitter`. HTTP-запросы вынесены в отдельный коммуникационный класс `LarekApi`.

# Базовый код

## Класс `Component<T>`

Абстрактный базовый класс для компонентов представления. Тип `T` описывает данные, которые компонент принимает в метод `render`.

### Конструктор

`constructor(container: HTMLElement)` — принимает корневой DOM-элемент компонента.

### Поля

- `container: HTMLElement` — защищённый корневой элемент компонента.

### Методы

- `render(data?: Partial<T>): HTMLElement` — передаёт данные в сеттеры компонента и возвращает корневой элемент;
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение и альтернативный текст.

## Класс `Api`

Базовый класс выполнения HTTP-запросов.

### Конструктор

`constructor(baseUrl: string, options: RequestInit = {})`.

### Поля

- `baseUrl: string` — базовый URL сервера;
- `options: RequestInit` — общие параметры HTTP-запросов.

### Методы

- `get<T extends object>(uri: string): Promise<T>` — GET-запрос;
- `post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>` — POST/PUT/DELETE-запрос;
- `handleResponse<T>(response: Response): Promise<T>` — обработка ответа сервера.

## Класс `EventEmitter`

Брокер событий, реализующий паттерн «Наблюдатель».

### Конструктор

Не принимает параметров.

### Поля

- `_events: Map<EventName, Set<Subscriber>>` — зарегистрированные подписчики.

### Методы

- `on<T extends object>(eventName: EventName, callback: (event: T) => void): void` — подписка;
- `off(eventName: EventName, callback: Subscriber): void` — удаление подписки;
- `emit<T extends object>(eventName: string, data?: T): void` — генерация события;
- `onAll(callback: (event: EmitterEvent) => void): void` — подписка на все события;
- `offAll(): void` — удаление всех подписок;
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (data: T) => void` — создание обработчика, генерирующего событие.

# Данные

Все типы приложения объявлены в `src/types/index.ts`.

## Основные типы предметной области

### `ApiPostMethods`

```ts
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
```

Поддерживаемые методом `Api.post` HTTP-методы.

### `IApi`

```ts
interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
```

Интерфейс коммуникационной зависимости `LarekApi`.

### `TPayment`

```ts
type TPayment = 'card' | 'cash';
```

Способы оплаты заказа.

### `IProduct`

```ts
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
```

Данные одного товара. `price: null` означает, что товар недоступен для покупки.

### `IBuyer`

```ts
interface IBuyer {
  payment: TPayment | '';
  email: string;
  phone: string;
  address: string;
}
```

Данные покупателя. Пустая строка `payment` используется до выбора способа оплаты.

### `TBuyerErrors`

```ts
type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;
```

Ошибки валидации полей покупателя.

### `IProductsResponse`

```ts
interface IProductsResponse {
  total: number;
  items: IProduct[];
}
```

Ответ сервера со списком товаров.

### `IOrder`

```ts
interface IOrder extends Omit<IBuyer, 'payment'> {
  payment: TPayment;
  total: number;
  items: string[];
}
```

Заказ, отправляемый на сервер.

### `IOrderResult`

```ts
interface IOrderResult {
  id: string;
  total: number;
}
```

Ответ сервера после успешного заказа.

## Типы слоя View и событий

- `IPageView` — каталог и количество товаров в корзине;
- `ICardView` — общие отображаемые данные карточки;
- `IPreviewCardView` — карточка подробного просмотра плюс состояние кнопки;
- `IBasketCardView` — компактная карточка плюс порядковый номер;
- `IBasketView` — элементы корзины, сумма и доступность оформления;
- `IFormView` — валидность формы и список ошибок;
- `IOrderFormView` — состояние формы оплаты и адреса;
- `IContactsFormView` — состояние формы email и телефона;
- `ISuccessView` — итоговая сумма успешного заказа;
- `IProductEvent` — `id` товара в событии;
- `IFormChangeEvent` — имя изменённого поля покупателя и его значение.

# Модели данных

Модели не содержат DOM-логики и не выполняют запросов к серверу. В конструктор каждой модели передаётся объект `IEvents`. Изменения состояния сопровождаются соответствующим событием.

## Класс `Products`

Хранит каталог и товар, выбранный для подробного просмотра.

### Конструктор

`constructor(events: IEvents)` — принимает брокер событий.

### Поля

- `items: IProduct[]` — массив товаров;
- `selectedItem: IProduct | null` — выбранный товар;
- `events: IEvents` — брокер событий.

### Методы

- `setItems(items: IProduct[]): void` — сохраняет каталог и генерирует `products:changed`;
- `getItems(): IProduct[]` — возвращает копию каталога;
- `getItemById(id: string): IProduct | undefined` — ищет товар по id;
- `setSelectedItem(item: IProduct): void` — сохраняет выбранный товар и генерирует `product:selected`;
- `getSelectedItem(): IProduct | null` — возвращает выбранный товар.

## Класс `Basket`

Хранит товары, выбранные для покупки.

### Конструктор

`constructor(events: IEvents)` — принимает брокер событий.

### Поля

- `items: IProduct[]` — товары корзины;
- `events: IEvents` — брокер событий.

### Методы

- `getItems(): IProduct[]` — возвращает копию массива корзины;
- `addItem(item: IProduct): void` — добавляет отсутствующий товар и генерирует `basket:changed`;
- `removeItem(item: IProduct): void` — удаляет существующий товар и генерирует `basket:changed`;
- `clear(): void` — очищает непустую корзину и генерирует `basket:changed`;
- `getTotal(): number` — вычисляет стоимость товаров;
- `getCount(): number` — возвращает количество товаров;
- `hasItem(id: string): boolean` — проверяет наличие товара по id.

## Класс `Buyer`

Хранит данные покупателя и выполняет их валидацию.

### Конструктор

`constructor(events: IEvents)` — принимает брокер событий.

### Поля

- `data: IBuyer` — текущие данные покупателя;
- `events: IEvents` — брокер событий.

### Методы

- `setData(data: Partial<IBuyer>): void` — частично обновляет данные и генерирует `buyer:changed`;
- `getData(): IBuyer` — возвращает копию данных;
- `clear(): void` — очищает данные и генерирует `buyer:changed`;
- `validate(): TBuyerErrors` — возвращает ошибки незаполненных полей.

# Слой представления

Все классы View работают только с дочерними DOM-элементами своего корневого контейнера. Элементы находятся и сохраняются в конструкторе, слушатели устанавливаются один раз. View не хранит бизнес-данные.

## Класс `Page`

Отвечает за каталог на главной странице и счётчик корзины.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`.

### Поля

- `gallery: HTMLElement` — контейнер каталога;
- `basketCounter: HTMLElement` — счётчик корзины;
- `basketButton: HTMLButtonElement` — кнопка открытия корзины.

### Интерфейс

- сеттер `catalog: HTMLElement[]` — заменяет карточки каталога;
- сеттер `basketCount: number` — обновляет счётчик;
- клик по корзине генерирует `basket:open`.

## Класс `Modal`

Универсальный контейнер модального окна. Другие компоненты от него не наследуются.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`.

### Поля

- `closeButton: HTMLButtonElement` — крестик;
- `contentElement: HTMLElement` — область содержимого.

### Методы и интерфейс

- сеттер `content: HTMLElement` — устанавливает самостоятельный компонент внутрь модального окна;
- `open(): void` — добавляет `modal_active`;
- `close(): void` — удаляет `modal_active` и очищает содержимое;
- клик по крестику или оверлею генерирует `modal:close`.

## Абстрактный класс `Card<T>`

Общий родитель всех трёх вариантов карточек.

### Конструктор

`constructor(container: HTMLElement)`.

### Поля

- `titleElement: HTMLElement` — название;
- `priceElement: HTMLElement` — цена;
- `imageElement: HTMLImageElement | null` — изображение при наличии;
- `categoryElement: HTMLElement | null` — категория при наличии;
- `descriptionElement: HTMLElement | null` — описание при наличии.

### Интерфейс

Сеттеры `title`, `price`, `image`, `category`, `description`. Категория отображается с классом из `categoryMap`.

## Класс `CatalogCard`

Наследует `Card<ICardView>`. Отображает товар в каталоге.

### Конструктор

`constructor(container: HTMLElement, events: IEvents, productId: string)`.

Клик по карточке генерирует `card:select` с id товара.

## Класс `PreviewCard`

Наследует `Card<IPreviewCardView>`. Отображает подробную информацию о товаре.

### Конструктор

`constructor(container: HTMLElement, events: IEvents, actionEvent: string, productId: string)`.

### Поля

- `actionButton: HTMLButtonElement` — кнопка покупки/удаления.

### Интерфейс

- сеттер `buttonText: string`;
- сеттер `buttonDisabled: boolean`;
- клик по кнопке генерирует переданное событие товара.

## Класс `BasketCard`

Наследует `Card<IBasketCardView>`. Отображает товар в корзине.

### Конструктор

`constructor(container: HTMLElement, events: IEvents, productId: string)`.

### Поля

- `indexElement: HTMLElement` — номер позиции;
- `deleteButton: HTMLButtonElement` — кнопка удаления.

### Интерфейс

- сеттер `index: number`;
- удаление генерирует `basket:remove`.

## Класс `BasketView`

Отвечает за содержимое корзины.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`.

### Поля

- `listElement: HTMLElement` — список товаров;
- `totalElement: HTMLElement` — сумма;
- `orderButton: HTMLButtonElement` — кнопка оформления.

### Интерфейс

- сеттер `items: HTMLElement[]`;
- сеттер `total: number`;
- сеттер `valid: boolean` — управляет `disabled`;
- клик по оформлению генерирует `order:open`.

## Абстрактный класс `Form<T>`

Общий родитель обеих форм.

### Конструктор

`constructor(container: HTMLFormElement, events: IEvents, submitEvent: string)`.

### Поля

- `submitButton: HTMLButtonElement` — submit-кнопка;
- `errorsElement: HTMLElement` — область ошибок.

### Интерфейс

- сеттер `valid: boolean` — доступность submit-кнопки;
- сеттер `errors: string[]` — отображение ошибок;
- изменение input генерирует `form:change`;
- submit генерирует событие, переданное в конструктор.

## Класс `OrderForm`

Наследует `Form<IOrderFormView>`. Первый шаг заказа.

### Конструктор

`constructor(container: HTMLFormElement, events: IEvents)`.

### Поля

- `paymentButtons: HTMLButtonElement[]` — кнопки оплаты;
- `addressInput: HTMLInputElement` — адрес.

### Интерфейс

- сеттер `payment: TPayment | ''` — выделяет выбранную кнопку модификатором `button_alt-active`;
- сеттер `address: string`;
- выбор оплаты генерирует `form:change`;
- submit генерирует `order:submit`.

## Класс `ContactsForm`

Наследует `Form<IContactsFormView>`. Второй шаг заказа.

### Конструктор

`constructor(container: HTMLFormElement, events: IEvents)`.

### Поля

- `emailInput: HTMLInputElement`;
- `phoneInput: HTMLInputElement`.

### Интерфейс

- сеттер `email: string`;
- сеттер `phone: string`;
- submit генерирует `contacts:submit`.

## Класс `Success`

Отображает результат успешного заказа.

### Конструктор

`constructor(container: HTMLElement, events: IEvents)`.

### Поля

- `descriptionElement: HTMLElement` — сумма списания;
- `closeButton: HTMLButtonElement` — кнопка закрытия.

### Интерфейс

- сеттер `total: number`;
- клик по кнопке генерирует `success:close`.

# Слой коммуникации

## Класс `LarekApi`

Предметный коммуникационный класс. Использует базовый `Api` через композицию и зависит от интерфейса `IApi`.

### Конструктор

`constructor(api: IApi)`.

### Поля

- `api: IApi` — read-only коммуникационная зависимость.

### Методы

- `getProducts(): Promise<IProductsResponse>` — GET `/product/`;
- `createOrder(order: IOrder): Promise<IOrderResult>` — POST `/order/`.

# События приложения

Имена событий хранятся в константе `EVENTS` в `src/utils/constants.ts`.

## События моделей

- `products:changed` — изменился каталог товаров;
- `product:selected` — изменился товар, выбранный для подробного просмотра;
- `basket:changed` — изменилось содержимое корзины;
- `buyer:changed` — изменились данные покупателя.

## События представлений

- `card:select` — пользователь выбрал карточку каталога;
- `product:add` — пользователь нажал «Купить»;
- `product:remove` — пользователь удаляет товар из подробной карточки;
- `basket:open` — пользователь открывает корзину;
- `basket:remove` — пользователь удаляет позицию из корзины;
- `order:open` — пользователь начинает оформление;
- `form:change` — изменено поле формы;
- `order:submit` — переход с первого шага на второй;
- `contacts:submit` — отправка заказа;
- `modal:close` — закрытие модального окна;
- `success:close` — закрытие сообщения об успешном заказе.

# Presenter

Presenter реализован в `src/main.ts` функциями и обработчиками событий, без отдельного класса.

Он выполняет следующие сценарии:

1. Создаёт единый `EventEmitter`, модели, коммуникационный слой и View-компоненты.
2. Загружает товары через `LarekApi.getProducts()` и сохраняет их в `Products`.
3. По `products:changed` получает каталог из модели, создаёт `CatalogCard` для каждого товара и передаёт разметку в `Page`.
4. По выбору товара сохраняет его в `Products`, а по `product:selected` открывает `PreviewCard` в `Modal`.
5. Состояние кнопки подробной карточки определяется в Presenter: «Купить», «Удалить из корзины» или «Недоступно».
6. Изменения `Basket` обновляют список, сумму и счётчик корзины.
7. Изменения формы сохраняются в `Buyer`. По `buyer:changed` Presenter получает данные и ошибки модели и передаёт соответствующее состояние в обе формы.
8. После корректного первого шага открывается форма контактов.
9. После корректного второго шага Presenter собирает `IOrder` из `Buyer` и `Basket` и вызывает `LarekApi.createOrder()`.
10. После успешного ответа показывает `Success`, очищает корзину и данные покупателя.

Presenter не вызывает `emit()`: генерация событий выполняется только моделями и представлениями.
