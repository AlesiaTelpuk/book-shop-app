import { Component } from "../Abstact/Component";
import { TBook, TReviews, TServices } from "../Abstact/Type";
import { CartReview } from "../Common/CartReview";


export class Reviews extends Component {
  data: TBook | null = null;
  btnInBasket: Component;
  btnFromBasket: Component;
  btnLike: Component;
  btnLike1: Component;
  btnComent: Component;
  divListComment: Component;
  textareaComent: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["reviews"]);


    const container = new Component(this.root, 'div', ["container"]);
    // const back = new Component(this.root, 'a',)
    new Component(container.root, 'h1', ["h1__title"], "Reviews");

    const addComment = new Component(container.root, 'div', ["add__comment"])

    const reviewsCard = new Component(addComment.root, 'div', ["reviews__card"])
    const cart = new Component(reviewsCard.root, 'div', ["cart__inner"])

    const imgBook = new Component(cart.root, 'img', ["book-img"], null, ["src", "alt"], ["", ""]);

    const priceBook = new Component(cart.root, 'p', ["book__price"], "");
    const nameBook = new Component(cart.root, 'p', ["book__name"], "");
    const authorBook = new Component(cart.root, 'span', ["book__author"], "");


    const buttons = new Component(reviewsCard.root, 'div', ["cart__buttons"])

    const like = new Component(buttons.root, 'div', ["cart__like"])
    this.btnLike = new Component(like.root, 'input', ["btn-like"], null, ["value", "type"], ["", "button"]);
    this.btnLike1 = new Component(like.root, 'input', ["btn-like1"], null, ["value", "type"], ["", "button"]);
    this.btnLike1.remove();

    // if (services.dbService.dataUser) { //если есть пользователь
    //   const index = services.dbService.dataUser.favorite.findIndex((el) => el.book.id === data.id); //и его корзина полная
    //   if (index >= 0) {
    //     this.btnLike.remove(); //удаляем кнопку "добавить в корзину"
    //     this.btnLike1.render();  //добавляем "убрать из корзины"
    //   }
    // }

    this.btnLike.root.onclick = () => {
      this.addBookInFavorite();
      this.btnLike.remove();
      this.btnLike1.render();
    }

    const basket = new Component(buttons.root, 'div', ["cart__basket-btn"])
    this.btnInBasket = new Component(basket.root, 'input', ["btn-basket"], null, ["value", "type"], ["", "button"]);
    this.btnFromBasket = new Component(basket.root, 'input', ["btn-inbasket"], null, ["value", "type"], ["", "button"]);
    this.btnFromBasket.remove()

    // if (services.dbService.dataUser) { //если есть пользователь
    //   const index = services.dbService.dataUser.basket.findIndex((el) => el.book.id === data.id); //и его корзина полная
    //   if (index >= 0) {
    //     this.btnInBasket.remove(); //удаляем кнопку "добавить в корзину"
    //     this.btnFromBasket.render();  //добавляем "убрать из корзины"
    //   }
    // }

    const divComment = new Component(addComment.root, 'div', ["comment__div"]);
    new Component(divComment.root, 'h1', ["h1__title"], "Leave a review");
    this.textareaComent = new Component(divComment.root, 'textarea', ["textarea"], '', ["placeholder"], ["Your review"]);
    this.btnComent = new Component(divComment.root, 'input', ["review__button"], null, ["value", "type"], ["Add a review", "button"]);
    this.btnComent.root.onclick = () => {
      (this.btnComent.root as HTMLInputElement).disabled = true;
      this.addReviewForBook((this.textareaComent.root as HTMLTextAreaElement).value);
    }

    this.divListComment = new Component(container.root, 'div', [])

    this.btnInBasket.root.onclick = () => { //при нажатии на кнопку "добавить в корзину"
      this.addBookInBasket(); //добавляем книгу в БД
      this.btnInBasket.remove();//удаляем кнопку "добавить в корзину"
      this.btnFromBasket.render();//добавляем "убрать из корзины"
    }

    this.divListComment = new Component(container.root, 'div', [])


    services.dbService.addListener('updateReviewsPage', (book) => {
      this.data = book as TBook;
      (imgBook.root as HTMLImageElement).src = this.data.url;
      (imgBook.root as HTMLImageElement).alt = this.data.name;
      priceBook.root.innerHTML = `${this.data.price} BYN`;
      nameBook.root.innerHTML = this.data.name;
      authorBook.root.innerHTML = this.data.author;

      if (services.dbService.dataUser) {
        const index = services.dbService.dataUser.basket.findIndex((el) => el.book.id === this.data?.id);
        if (index >= 0) {
          this.btnInBasket.remove(); //удаляем кнопку "добавить в корзину"
          this.btnFromBasket.render();  //добавляем "убрать из корзины"
        } else {
          this.btnInBasket.render();
          this.btnFromBasket.remove();
        }
      }

      if (services.dbService.dataUser) { //если есть пользователь
        const index = services.dbService.dataUser.favorite.findIndex((el) => el.book.id === this.data?.id); //и его корзина полная
        if (index >= 0) {
          this.btnLike.remove(); //удаляем кнопку "добавить в корзину"
          this.btnLike1.render();  //добавляем "убрать из корзины"
        } else {
          this.btnLike.render();
          this.btnLike1.remove();
        }
      }

      services.dbService.getAllReviews(this.data).then((comments) => {
        this.divListComment.root.innerHTML = "";
        (comments as TReviews[]).forEach((comment) => {
          new CartReview(this.divListComment.root, comment);
        });
      });
    });
    services.dbService.addListener('delBookFromBasket', (idBook) => {
      if (this.data && idBook === this.data.id) {  //если id удаленной книги совпадает с id карточки в каталоге, то у нее
        this.btnInBasket.render();//добавляем кнопку "добавить в корзину"
        this.btnFromBasket.remove();//удаляем кнопку "убрать из корзины"
      }
    });
    services.dbService.addListener('delBookFromBasket', (idBook) => {
      if (this.data && idBook === this.data.id) {  //если id удаленной книги совпадает с id карточки в каталоге, то у нее
        this.btnInBasket.render();//добавляем кнопку "добавить в корзину"
        this.btnFromBasket.remove();//удаляем кнопку "убрать из корзины"
      }
    });
  }
  addBookInBasket() {
    if (!this.data) {
      this.btnInBasket.render();
      this.btnFromBasket.remove();
      return;
    }
    const user = this.services.authService.user; //получаем пользователя
    this.services.dbService.addBookInBasket(user, this.data)//а затем добавляем карточку книги в корзину
      .catch(() => {
        this.btnInBasket.render();
        this.btnFromBasket.remove();
      })
  }
  addBookInFavorite() {
    if (!this.data) {
      this.btnLike.render();
      this.btnLike1.remove();
      return;
    }
    const user = this.services.authService.user; //получаем пользователя
    this.services.dbService.addBookInFavorite(user, this.data)//а затем добавляем карточку книги в корзину
      .catch(() => {
        this.btnLike.render();
        this.btnLike1.remove();
      })
  }
  addReviewForBook(coment: string) {
    if (!this.data || coment.trim() === '') {
      (this.btnComent.root as HTMLInputElement).disabled = false;
      return;
    }
    const user = this.services.authService.user;
    this.services.dbService.addReviewForBook(user, this.data, coment).then(() => {
      const newReview = new CartReview(this.divListComment.root, {
        comment: coment,
        username: user?.displayName as string,
        // date: new Date()
      });
      newReview.remove(); newReview.parrent.prepend(newReview.root);
      (this.textareaComent.root as HTMLTextAreaElement).value = "";
    }).finally(() => {
      (this.btnComent.root as HTMLInputElement).disabled = false;
    })
  }
}