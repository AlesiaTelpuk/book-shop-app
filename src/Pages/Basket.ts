import { Component } from "../Abstact/Component";


export class Basket extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "div", ["basket"]);
    const container = new Component(this.root, 'div', ["container"]);
    new Component(container.root, 'h1', null, "Basket");
  }
}