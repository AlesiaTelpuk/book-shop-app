import { Component } from "../Abstact/Component";

export class Footer extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "footer", ["footer"]);
    const container = new Component(this.root, 'div', ["container"]);
    const footer__inner = new Component(container.root, 'div', ["footer__inner"]);

    new Component(footer__inner.root, 'h1', ["h1"], 'Bookstore');

    const contacts = new Component(footer__inner.root, 'div');
    new Component(contacts.root, 'h3', ['contacts__inner'], 'Contact us');
    new Component(contacts.root, 'p', ['contacts__inner'], "Tel: +375 29 9824917");
    new Component(contacts.root, 'p', ['contacts__inner'], "e-mail: bookstore@mail.ru");
    const icon1 = new Component(contacts.root, 'a', ["icon1__a"], null, ["href"], ["#"]);
    new Component(icon1.root, 'img', ["icons__footer"], null, ["src", "alt"], ["./assets/Icons/Insta.svg", "insta"]);
    const icon2 = new Component(contacts.root, 'a', ["icon2__a"], null, ["href"], ["#"]);
    new Component(icon2.root, 'img', ["icons__footer"], null, ["src", "alt"], ["./assets/Icons/Telegram.svg", "telegram"]);

    const account = new Component(footer__inner.root, 'div', ['contacts__inner']);
    new Component(account.root, 'h3', null, 'My account');
    const account__ul = new Component(account.root, 'ul');
    const account__li = new Component(account__ul.root, 'li', ["footer__li"]);
    new Component(account__li.root, 'a', null, "Personal account", ["href"], ["#"]);
    new Component(account__li.root, 'a', null, "My orders", ["href"], ["#"]);
    new Component(account__li.root, 'a', null, "Basket", ["href"], ["#"]);
    new Component(account__li.root, 'a', null, "My favorite", ["href"], ["#"]);

    const information = new Component(footer__inner.root, 'div', ['contacts__inner']);
    new Component(information.root, 'h3', null, 'Information');
    const infa__ul = new Component(information.root, 'ul');
    const infa__li = new Component(infa__ul.root, 'li', ["footer__li"]);
    new Component(infa__li.root, 'a', null, "About us", ["href"], ["#"]);
    new Component(infa__li.root, 'a', null, "Delivery", ["href"], ["#"]);

    const ssik = new Component(container.root, 'div', ['ssik__inner']);
    const ssik__ul = new Component(ssik.root, 'ul');
    const ssik__li = new Component(ssik__ul.root, 'li', ["ssik__li"]);
    new Component(ssik__li.root, 'a', null, "GitHub", ["href"], ["https://github.com/AlesiaTelpuk/book-shop-app/tree/develop"]);
    new Component(ssik__li.root, 'a', null, "Figma", ["href"], ["https://www.figma.com/file/LLylWyL7YjXeHOac41fZTx/Bookstore?type=design&node-id=0%3A1&mode=design&t=ALTnxIKrEHhg3Kzr-1"]);
    new Component(ssik__li.root, 'p', null, "Alesia Tialpuk EM-3");
  }
}