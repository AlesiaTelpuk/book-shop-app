import { Component } from "../Abstact/Component";
import { TBook, TBookBasket, TBookFavorite, TServices } from "../Abstact/Type";


export class BookCart extends Component {
  btnInBasket: Component;
  btnFromBasket: Component;
  btnLike: Component;
  btnLike1: Component;
  constructor(parrent: HTMLElement, private services: TServices, private data: TBook) {
    super(parrent, 'div', ["cart"]);
    const cart = new Component(this.root, 'div', ["cart__inner"])

    new Component(cart.root, 'img', ["book-img"], null, ["src", "alt"], [data.url, data.name]);


    new Component(cart.root, 'p', ["book__price"], data.price + " BYN");
    new Component(cart.root, 'p', ["book__name"], data.name);
    new Component(cart.root, 'span', ["book__author"], data.author);

    (cart.root as HTMLButtonElement).onclick = () => {
      services.dbService.openReviewsPage(data);
    }
    // new Component(this.root, 'p', ["book__genre"], "Genre: " + data.genre.join(', '));
    // new Component(this.root, 'p', ["book__genre"], data.genre.reduce((s, el) => "Genre: " + s + ", " + el));
    const buttons = new Component(this.root, 'div', ["cart__buttons"])

    const like = new Component(buttons.root, 'div', ["cart__like"])
    this.btnLike = new Component(like.root, 'input', ["btn-like"], null, ["value", "type"], ["", "button"]);
    this.btnLike1 = new Component(like.root, 'input', ["btn-like1"], null, ["value", "type"], ["", "button"]);
    this.btnLike1.remove();
    // new Component(btnLike.root, 'img', ["cartbook-btn"], null, ["src", "alt"], ["./assets/Icons/Like.svg", "Like"]);
    if (services.dbService.dataUser) { //если есть пользователь
      const index = services.dbService.dataUser.favorite.findIndex((el) => el.book.id === data.id); //и его корзина полная
      if (index >= 0) {
        this.btnLike.remove(); //удаляем кнопку "добавить в корзину"
        this.btnLike1.render();  //добавляем "убрать из корзины"
      }
    }

    this.btnLike.root.onclick = () => {
      this.addBookInFavorite();
      this.btnLike.remove();
      this.btnLike1.render();
    }
    // this.btnLike1.root.onclick = () => {
    //   this.delBookFromFavorite();
    //   this.btnLike.render();
    //   this.btnLike1.remove();
    // }

    const basket = new Component(buttons.root, 'div', ["cart__basket-btn"])
    this.btnInBasket = new Component(basket.root, 'input', ["btn-basket"], null, ["value", "type"], ["", "button"]);
    this.btnFromBasket = new Component(basket.root, 'input', ["btn-inbasket"], null, ["value", "type"], ["", "button"]);
    this.btnFromBasket.remove()

    if (services.dbService.dataUser) { //если есть пользователь
      const index = services.dbService.dataUser.basket.findIndex((el) => el.book.id === data.id); //и его корзина полная
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
      if (idBook === data.id) {  //если id удаленной книги совпадает с id карточки в каталоге, то у нее
        this.btnInBasket.render();//добавляем кнопку "добавить в корзину"
        this.btnFromBasket.remove();//удаляем кнопку "убрать из корзины"
      }
    });
    services.dbService.addListener('delBookFromFavorite', (idBook) => {
      if (idBook === data.id) {  //если id удаленной книги совпадает с id карточки в каталоге, то у нее
        this.btnLike.render();//добавляем кнопку "добавить в корзину"
        this.btnLike1.remove();//удаляем кнопку "убрать из корзины"
      }
    });
  }

  addBookInBasket() {
    const user = this.services.authService.user; //получаем пользователя
    this.services.dbService.addBookInBasket(user, this.data)//а затем добавляем карточку книги в корзину
      .catch(() => {
        this.btnInBasket.render();
        this.btnFromBasket.remove();
        // (this.btnBasket.root as HTMLInputElement).disabled = false;
      })
  }
  addBookInFavorite() {
    const user = this.services.authService.user; //получаем пользователя
    this.services.dbService.addBookInFavorite(user, this.data)//а затем добавляем карточку книги в корзину
      .catch(() => {
        this.btnLike.render();
        this.btnLike1.remove();
      })
  }
  // delBookFromFavorite() {
  //   const user = this.services.authService.user; //получаем пользователя
  //   this.services.dbService.delBookFromFavorite(user, this.)//а затем добавляем карточку книги в корзину
  //     .catch(() => {
  //       this.btnLike.remove();
  //       this.btnLike1.render();
  //     })
  // }

}