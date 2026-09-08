import './scss/styles.scss';
import { Api } from './components/base/Api';
import { LarekApi } from './components/Api/LarekApi';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Products } from './components/Models/Products';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Проверка модели каталога товаров.
productsModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
const secondProduct = productsModel.getItems()[1];

if (firstProduct) {
  console.log(
    'Товар, найденный по id:',
    productsModel.getItemById(firstProduct.id)
  );

  productsModel.setSelectedItem(firstProduct);
  console.log(
    'Товар для подробного отображения:',
    productsModel.getSelectedItem()
  );
}

console.log(
  'Результат поиска товара с несуществующим id:',
  productsModel.getItemById('unknown-product-id')
);

// Проверка модели корзины.
console.log('Товары в пустой корзине:', basketModel.getItems());

if (firstProduct) {
  basketModel.addItem(firstProduct);
}

if (secondProduct) {
  basketModel.addItem(secondProduct);
}

console.log('Товары после добавления в корзину:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость товаров в корзине:', basketModel.getTotal());

if (firstProduct) {
  console.log(
    'Первый товар находится в корзине:',
    basketModel.hasItem(firstProduct.id)
  );
  basketModel.removeItem(firstProduct);
}

console.log('Корзина после удаления товара:', basketModel.getItems());
basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());
console.log('Количество товаров после очистки:', basketModel.getCount());
console.log('Стоимость товаров после очистки:', basketModel.getTotal());

// Проверка модели покупателя.
console.log('Начальные данные покупателя:', buyerModel.getData());
console.log('Ошибки пустых данных покупателя:', buyerModel.validate());

buyerModel.setData({ address: 'Москва, ул. Примерная, 1' });
buyerModel.setData({ payment: 'card' });
buyerModel.setData({ email: 'buyer@example.com' });
buyerModel.setData({ phone: '+79990000000' });

console.log('Заполненные данные покупателя:', buyerModel.getData());
console.log('Ошибки заполненных данных покупателя:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());
console.log('Ошибки после очистки данных покупателя:', buyerModel.validate());

// Получение каталога с сервера и сохранение результата в модель.
larekApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
    console.log(
      'Каталог, полученный с сервера и сохранённый в модели:',
      productsModel.getItems()
    );
  })
  .catch((error: unknown) => {
    console.error('Ошибка загрузки каталога с сервера:', error);
  });
