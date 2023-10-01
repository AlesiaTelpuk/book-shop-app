import { Component } from "../Abstact/Component";


export class Account extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "div", ["account"]);
    const container = new Component(this.root, 'div', ["container"]);
    new Component(container.root, 'h1', null, "Account");
  }
}