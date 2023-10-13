import { Component } from "../Abstact/Component";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { TServices } from "../Abstact/Type";

export class Authorization extends Component {
  regButton: Component;
  outButton: Component;
  constructor(parrent: HTMLElement, private services: TServices) {
    super(parrent, "div", ["authorization"]);
    const container = new Component(this.root, 'div', ["container"]);
    new Component(container.root, 'h1', ["title"], "Authorization");
    const row = new Component(container.root, 'div', ["auth__row"]);
    new Component(row.root, 'p', ["auth__row-p"], "By creating an account on our website, you will spend less time on ordering, you will be able to store multiple delivery addresses, track orders, add books to favorites, view statistics, leave reviews and ratings.");

    this.regButton = new Component(row.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Log in using Google"]);
    this.regButton.root.onclick = () => {
      this.services.authService.authWidthGoogle();
    }

    this.outButton = new Component(row.root, 'input', ["auth__btn"], null, ["type", "value"], ["button", "Log out"]);
    this.outButton.root.onclick = () => {
      this.services.authService.outFromGoogle();
    }

    // const auth = getAuth();
    // const user = auth.currentUser;
    const user = this.services.authService.user;
    if (user) {
      this.toggleButton(true);
      // window.location.reload();
    } else {
      this.toggleButton(false);
    }

    this.services.authService.addListener('userAuth', (isAuthUser) => {
      if (isAuthUser) {
        this.toggleButton(true)
      } else {
        this.toggleButton(false)
      }
    })
  }


  toggleButton(isAuthUser: boolean): void {
    if (isAuthUser) {
      this.regButton.remove();
      this.outButton.render();
    } else {
      this.regButton.render();
      this.outButton.remove();
    }
  }
}