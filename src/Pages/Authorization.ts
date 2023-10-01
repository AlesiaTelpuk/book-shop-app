import { Component } from "../Abstact/Component";


export class Authorization extends Component {
  constructor(parrent: HTMLElement) {
    super(parrent, "div", ["authorization"]);
    new Component(this.root, 'h1', null, "Authorization");
  }
}