import { Component } from "../Abstact/Component";
import { TBookFavorite, TServices } from "../Abstact/Type";

export class FavoriteBlock extends Component {
  btnInBasket: Component;
  btnFromBasket: Component;
  btnDelLike: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TBookFavorite) {
    super(parrent, 'div', ["cartfavorite"]);
    const cart = new Component(this.root, 'div', ["cart__inner-basket"]);

    const info = new Component(cart.root, 'div', ["basket__info"]);
    new Component(info.root, 'img', ["book-img"], null, ["src", "alt"], [data.book.url, data.book.name]);
    new Component(info.root, 'p', ["book__price"], data.book.price + " BYN");
    new Component(info.root, 'p', ["book__name"], data.book.name);
    new Component(info.root, 'p', ["book__author"], data.book.author);

    const buttons = new Component(cart.root, 'div', ["btn__favoritecart"]);
    const btnFromLike = new Component(buttons.root, 'div', ["btn__basket-like"]);
    this.btnDelLike = new Component(btnFromLike.root, 'input', ["btn-delfromfavorite"], null, ["value", "type"], ["", "button"]);
    this.btnDelLike.root.onclick = () => {
      this.delBookFromFavorite();
    }

    const basket = new Component(buttons.root, 'div', ["cart__basket-btn"])
    this.btnInBasket = new Component(basket.root, 'input', ["btn-basket"], null, ["value", "type"], ["", "button"]);
    this.btnFromBasket = new Component(basket.root, 'input', ["btn-inbasket"], null, ["value", "type"], ["", "button"]);
    this.btnFromBasket.remove();

    if (services.dbService.dataUser) { //если есть пользователь
      const index = services.dbService.dataUser.basket.findIndex((el) => el.book.id === data.book.id); //и его корзина полная
      if (index >= 0) {
        this.btnInBasket.remove(); //удаляем кнопку "добавить в корзину"
        this.btnFromBasket.render();  //добавляем "убрать из корзины"
      }
    }

    this.btnInBasket.root.onclick = () => { //при нажатии на кнопку "добавить в корзину"
      this.addBookInBasket(); //добавляем книгу в БД
      this.btnInBasket.remove();//удаляем кнопку "добавить в корзину"
      this.btnFromBasket.render();//добавляем "убрать из корзины"
    }

    services.dbService.addListener('delBookFromBasket', (idBook) => {
      if (idBook === data.book.id) {  //если id удаленной книги совпадает с id карточки в каталоге, то у нее
        this.btnInBasket.render();//добавляем кнопку "добавить в корзину"
        this.btnFromBasket.remove();//удаляем кнопку "убрать из корзины"
      }
    })
  }
  addBookInBasket() {
    const user = this.services.authService.user; //получаем пользователя
    this.services.dbService.addBookInBasket(user, this.data.book)//а затем добавляем карточку книги в корзину
      .catch(() => {
        this.btnInBasket.render();
        this.btnFromBasket.remove();
        // (this.btnBasket.root as HTMLInputElement).disabled = false;
      })
  }
  delBookFromFavorite() {
    const user = this.services.authService.user;
    this.services.dbService.
      delBookFromFavorite(user, this.data)
      .then(() => {
        this.remove();
      })
      .catch(() => {

      })
  }
}