import './scss/styles.scss';
import { LarekApi } from './components/Api/LarekApi';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Products } from './components/Models/Products';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { BasketCard } from './components/View/BasketCard';
import { BasketView } from './components/View/BasketView';
import { CatalogCard } from './components/View/CatalogCard';
import { ContactsForm } from './components/View/ContactsForm';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { Page } from './components/View/Page';
import { PreviewCard } from './components/View/PreviewCard';
import { Success } from './components/View/Success';
import type {
  ICardView,
  IFormChangeEvent,
  IOrder,
  IProduct,
  IProductEvent,
} from './types';
import { API_URL, CDN_URL, EVENTS } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const PRODUCT_ADD_TEXT = 'Купить';
const PRODUCT_REMOVE_TEXT = 'Удалить из корзины';
const PRODUCT_UNAVAILABLE_TEXT = 'Недоступно';

const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const page = new Page(ensureElement<HTMLElement>('.page'), events);
const modal = new Modal(
  ensureElement<HTMLElement>('#modal-container'),
  events
);
const basketView = new BasketView(
  cloneTemplate<HTMLElement>('#basket'),
  events
);
const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>('#order'),
  events
);
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>('#contacts'),
  events
);
const successView = new Success(
  cloneTemplate<HTMLElement>('#success'),
  events
);

function getCardData(product: IProduct): ICardView {
  return {
    title: product.title,
    price: product.price,
    category: product.category,
    image: `${CDN_URL}${product.image}`,
    description: product.description,
  };
}

function renderCatalog(): void {
  const cards = productsModel.getItems().map((product) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>('#card-catalog'),
      events,
      product.id
    );

    return card.render(getCardData(product));
  });

  page.render({ catalog: cards });
}

function renderBasket(): void {
  const items = basketModel.getItems();
  const cards = items.map((product, index) => {
    const card = new BasketCard(
      cloneTemplate<HTMLElement>('#card-basket'),
      events,
      product.id
    );

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basketView.render({
    items: cards,
    total: basketModel.getTotal(),
    valid: basketModel.getCount() > 0,
  });

  page.render({ basketCount: basketModel.getCount() });
}

function renderBuyerForms(): void {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();

  const orderErrors = [errors.payment, errors.address].filter(
    (error): error is string => Boolean(error)
  );
  const contactsErrors = [errors.email, errors.phone].filter(
    (error): error is string => Boolean(error)
  );

  orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    errors: orderErrors,
    valid: orderErrors.length === 0,
  });

  contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    errors: contactsErrors,
    valid: contactsErrors.length === 0,
  });
}

function openProductPreview(): void {
  const product = productsModel.getSelectedItem();
  if (!product) {
    return;
  }

  const isUnavailable = product.price === null;
  const isInBasket = basketModel.hasItem(product.id);
  const actionEvent = isInBasket ? EVENTS.productRemove : EVENTS.productAdd;
  const buttonText = isUnavailable
    ? PRODUCT_UNAVAILABLE_TEXT
    : isInBasket
      ? PRODUCT_REMOVE_TEXT
      : PRODUCT_ADD_TEXT;

  const previewCard = new PreviewCard(
    cloneTemplate<HTMLElement>('#card-preview'),
    events,
    actionEvent,
    product.id
  );

  modal.render({
    content: previewCard.render({
      ...getCardData(product),
      buttonText,
      buttonDisabled: isUnavailable,
    }),
  });
  modal.open();
}

function openBasket(): void {
  renderBasket();
  modal.render({ content: basketView.render() });
  modal.open();
}

function openOrderForm(): void {
  renderBuyerForms();
  modal.render({ content: orderForm.render() });
  modal.open();
}

function openContactsForm(): void {
  renderBuyerForms();
  modal.render({ content: contactsForm.render() });
  modal.open();
}

function updateBuyerField({ field, value }: IFormChangeEvent): void {
  switch (field) {
    case 'payment':
      if (value === 'card' || value === 'cash') {
        buyerModel.setData({ payment: value });
      }
      break;
    case 'address':
      buyerModel.setData({ address: value });
      break;
    case 'email':
      buyerModel.setData({ email: value });
      break;
    case 'phone':
      buyerModel.setData({ phone: value });
      break;
  }
}

function submitOrder(): void {
  const buyer = buyerModel.getData();
  const errors = buyerModel.validate();
  const basketItems = basketModel.getItems();

  if (
    Object.keys(errors).length > 0 ||
    !buyer.payment ||
    basketItems.length === 0
  ) {
    return;
  }

  const order: IOrder = {
    ...buyer,
    payment: buyer.payment,
    total: basketModel.getTotal(),
    items: basketItems.map((item) => item.id),
  };

  larekApi
    .createOrder(order)
    .then((result) => {
      modal.render({ content: successView.render({ total: result.total }) });
      modal.open();
      basketModel.clear();
      buyerModel.clear();
    })
    .catch((error: unknown) => {
      console.error('Ошибка оформления заказа:', error);
    });
}

// События моделей.
events.on(EVENTS.productsChanged, renderCatalog);
events.on(EVENTS.productSelected, openProductPreview);
events.on(EVENTS.basketChanged, renderBasket);
events.on(EVENTS.buyerChanged, renderBuyerForms);

// События представлений.
events.on<IProductEvent>(EVENTS.cardSelect, ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product) {
    productsModel.setSelectedItem(product);
  }
});

events.on<IProductEvent>(EVENTS.productAdd, ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product && product.price !== null) {
    basketModel.addItem(product);
    modal.close();
  }
});

events.on<IProductEvent>(EVENTS.productRemove, ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product) {
    basketModel.removeItem(product);
    modal.close();
  }
});

events.on<IProductEvent>(EVENTS.basketRemove, ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product) {
    basketModel.removeItem(product);
  }
});

events.on(EVENTS.basketOpen, openBasket);
events.on(EVENTS.orderOpen, openOrderForm);
events.on(EVENTS.orderSubmit, openContactsForm);
events.on<IFormChangeEvent>(EVENTS.formChange, updateBuyerField);
events.on(EVENTS.contactsSubmit, submitOrder);
events.on(EVENTS.modalClose, () => modal.close());
events.on(EVENTS.successClose, () => modal.close());

// Начальное состояние и загрузка каталога.
renderBasket();

larekApi.getProducts().then((response) => {
  productsModel.setItems(response.items);
}).catch((error: unknown) => {
  console.error('Ошибка загрузки каталога:', error);
});
