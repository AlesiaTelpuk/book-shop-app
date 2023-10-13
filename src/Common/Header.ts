import { Component } from "../Abstact/Component";
import { TServices } from "../Abstact/Type";

export class Header extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "header", ["header"]);
    const container = new Component(this.root, 'div', ["container"]);
    const header__inner = new Component(container.root, 'div', ["header__inner"]);
    new Component(header__inner.root, 'h1', ["h1"], 'Bookstore');
    const header__nav = new Component(header__inner.root, "nav", ["header__nav"]);
    new Component(header__nav.root, "a", null, "Catalog", ["href"], ["#catalog"]);
    new Component(header__nav.root, "a", null, "Contact us", ["href"], ["#"]);
    new Component(header__nav.root, "a", null, "Reviews", ["href"], ["#reviews"]);
    const icons = new Component(header__inner.root, 'div', ["header__icons"]);
    const icon1 = new Component(icons.root, 'a', ["icon1__a"], null, ["href"], ["#authorization"]);
    const person = new Component(icon1.root, 'img', ["icons"], null, ["src", "alt"], ["./assets/Icons/Person.svg", "person"]);
    const personAuth = new Component(icon1.root, 'img', ["icons"], null, ["src", "alt"], ["./assets/Icons/PersonAuth.svg", "person"]);
    const user = this.services.authService.user;
    if (user) {
      person.remove(); personAuth.render();
    } else {
      personAuth.remove();
      person.render();
    }
    const icon2 = new Component(icons.root, 'a', ["icon2__a"], null, ["href"], ["#basket"]);
    new Component(icon2.root, 'img', ["icons"], null, ["src", "alt"], ["./assets/Icons/Basket.svg", "basket"]);
  }
}