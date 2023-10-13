import { Component } from "../Abstact/Component";
import { TServices } from "../Abstact/Type";


export class Account extends Component {
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["account"]);
    const container = new Component(this.root, 'div', ["container"]);
    new Component(container.root, 'h1', null, "Account");
  }
}