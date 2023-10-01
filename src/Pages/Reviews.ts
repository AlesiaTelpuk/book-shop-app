import { Component } from "../Abstact/Component";


export class Reviews extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "div", ["reviews"]);
    const container = new Component(this.root, 'div', ["container"]);
    new Component(container.root, 'h1', null, "Reviews");
  }
}