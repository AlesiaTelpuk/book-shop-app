type TParams = string | number | boolean | object | null;

type TObserver = {
  name: string;
  callback: (...params: TParams[]) => void;
};

export class Observer {
  private listeners: TObserver[] = [];

  addListener(name: string, callback: (...params: TParams[]) => void): void { //выполнение каких-то действий в функции по какой-то команде и передаче параметра
    this.listeners.push({ name, callback });
  }

  dispatch(name: string, ...params: TParams[]): void { //функция подписки на наблюдателя по какой-то команде и передаче параметра
    this.listeners
      .filter((it) => it.name === name)
      .forEach((it) => it.callback(...params));
  }
}