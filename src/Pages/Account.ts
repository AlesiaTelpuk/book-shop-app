import { Component } from "../Abstact/Component";
import { TBookFavorite, TDataUser, TServices } from "../Abstact/Type";
import { FavoriteBlock } from "../Common/FavoriteBlock";


export class Account extends Component {
  outButton: Component;
  Favorite: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["account"]);
    const container = new Component(this.root, 'div', ["container"]);

    const myAccount = new Component(container.root, 'div', ["myAccount", "top__indent"]);
    new Component(myAccount.root, 'h1', ["h1__title"], "My account");

    const acc_inner = new Component(myAccount.root, 'div', ["account__inner", "top__indent"]);
    new Component(acc_inner.root, 'img', ["account-img"], null, ['src', 'alt'], ["./assets/Photo/Person.png", "Person"]);

    const acc_info = new Component(acc_inner.root, 'div', ["account__info"]);
    const acc_name = new Component(acc_info.root, 'div', ["account__name"]);

    const teg_name = new Component(acc_name.root, 'div', ["account__info-name"])
    new Component(teg_name.root, 'p', null, 'Name:')
    new Component(teg_name.root, 'p', null, 'e-mail:')

    const content_name = new Component(acc_name.root, 'div', ["account__info-name"])
    new Component(content_name.root, 'p', null, this.services.dbService.dataUser?.name)
    new Component(content_name.root, 'p', null, this.services.dbService.dataUser?.email)

    // const person_stat = new Component(acc_info.root, 'div', ["account__info-personstat"])
    // new Component(person_stat.root, 'p', null, 'The total amount of<br>the redemption:')
    // new Component(person_stat.root, 'p', null, '765 $')

    this.outButton = new Component(acc_info.root, 'input', ["mainbutton"], null, ["type", "value"], ["button", "Log out"]);
    this.outButton.root.onclick = () => {
      this.services.authService.outFromGoogle();
    }

    const stat = new Component(container.root, 'div', ["stat", "top__indent"]);
    new Component(container.root, 'h1', ["h1__title"], "Statistics");

    const favorit = new Component(container.root, 'div', ["favorit", "top__indent"]);
    new Component(favorit.root, 'h1', ["h1__title"], "Favorite books");

    this.Favorite = new Component(favorit.root, 'div', ["favorite__block"])
    if (services.dbService.dataUser) //если пользователь существует
      services.dbService.dataUser.favorite.forEach(el => { //то для каждого элемента в корзине
        this.putBooksInFavorite(this.Favorite, el); //вызвать функцию, которая добавляет карточку товара на страницу корзины
      });

    services.dbService.addListener('bookInFavorite', (tovar) => {//при команде "bookInBasket"
      this.putBooksInFavorite(this.Favorite, tovar as TBookFavorite);
    });
  }
  putBooksInFavorite(teg: Component, tovar: TBookFavorite) {
    new FavoriteBlock(teg.root, this.services, tovar);
  }
}