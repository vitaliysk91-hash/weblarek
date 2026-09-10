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
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { PreviewCard } from './components/View/PreviewCard';
import { Success } from './components/View/Success';
import type {
  ICatalogCardView,
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

const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));
const basketView = new BasketView(cloneTemplate<HTMLElement>('#basket'), events);
const previewCard = new PreviewCard(
  cloneTemplate<HTMLElement>('#card-preview'),
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

function getCatalogCardData(product: IProduct): ICatalogCardView {
  return {
    title: product.title,
    price: product.price,
    category: product.category,
    image: `${CDN_URL}${product.image}`,
  };
}

function renderCatalog(): void {
  const cards = productsModel.getItems().map((product) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>('#card-catalog'),
      events,
      product.id
    );

    return card.render(getCatalogCardData(product));
  });

  gallery.render({ catalog: cards });
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

  header.render({ basketCount: basketModel.getCount() });
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

function renderProductPreview(): void {
  const product = productsModel.getSelectedItem();
  if (!product) {
    return;
  }

  const isUnavailable = product.price === null;
  const isInBasket = basketModel.hasItem(product.id);
  const buttonText = isUnavailable
    ? PRODUCT_UNAVAILABLE_TEXT
    : isInBasket
      ? PRODUCT_REMOVE_TEXT
      : PRODUCT_ADD_TEXT;

  modal.render({
    content: previewCard.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: `${CDN_URL}${product.image}`,
      description: product.description,
      buttonText,
      buttonDisabled: isUnavailable,
    }),
  });
  modal.open();
}

function openBasket(): void {
  modal.render({ content: basketView.render() });
  modal.open();
}

function openOrderForm(): void {
  modal.render({ content: orderForm.render() });
  modal.open();
}

function openContactsForm(): void {
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

function handleProductAction(): void {
  const product = productsModel.getSelectedItem();
  if (!product || product.price === null) {
    return;
  }

  if (basketModel.hasItem(product.id)) {
    basketModel.removeItem(product);
  } else {
    basketModel.addItem(product);
  }

  modal.close();
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

// Представления с данными обновляются только в событиях моделей.
events.on(EVENTS.productsChanged, renderCatalog);
events.on(EVENTS.productSelected, renderProductPreview);
events.on(EVENTS.basketChanged, renderBasket);
events.on(EVENTS.buyerChanged, renderBuyerForms);

// События представлений меняют модели или открывают уже созданные компоненты.
events.on<IProductEvent>(EVENTS.cardSelect, ({ id }) => {
  const product = productsModel.getItemById(id);
  if (product) {
    productsModel.setSelectedItem(product);
  }
});

events.on(EVENTS.productAction, handleProductAction);

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
events.on(EVENTS.successClose, () => modal.close());

larekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((error: unknown) => {
    console.error('Ошибка загрузки каталога:', error);
  });
