import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { addDoc, collection, doc, DocumentData, Firestore, getDoc, getDocs, getFirestore, orderBy, query, runTransaction, setDoc, Timestamp, where } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Component } from "../Abstact/Component";
import { Observer } from "../Abstact/Observer";
import { TBook, TBookBasket, TBookFavorite, TCriteria, TDataBasket, TDataHistory, TDataHistoryWithId, TDataUser } from "../Abstact/Type";


export class DBService extends Observer {
  private db: Firestore = getFirestore(this.DBFirestore);

  dataUser: TDataUser | null = null; //массив пользователя

  dataBasket: TDataBasket = {
    summa: 0,
    percent: 0,
    allSumma: 0,
    count: 0
  }

  constructor(private DBFirestore: FirebaseApp) {
    super();
  }

  calcCostBook(count: number, price: number): number {
    const cost = count * price;
    return cost;
  }

  calcDataBasket() { //высчитывает общую сумму корзины
    if (!this.dataUser) return;
    let summa = 0;
    let count = 0;
    this.dataUser.basket.forEach(el => {
      summa += el.count * Number(el.book.price);
      count += el.count;
    })
    const percent = count >= 3 ? 15 : 0;
    const allSumma = summa - summa * percent / 100;

    this.dataBasket.summa = summa;
    this.dataBasket.percent = percent;
    this.dataBasket.allSumma = allSumma;
    this.dataBasket.count = count;
  }

  async getAllBooks(criteria: TCriteria): Promise<TBook[]> {   //получение массива карточки книг из хранилища
    const crit = [];
    if (criteria.genre != 'all') crit.push(where("genre", "array-contains", criteria.genre));
    if (criteria.price === "up") {
      crit.push(orderBy("price", "asc"));
    } else {
      crit.push(orderBy("price", "desc"));
    }
    const q = query(collection(this.db, "book"), ...crit);
    const querySnapshot = await getDocs(q); //получаем коллекцию по названию 'book' из базы данных
    const storage = getStorage(); //инициализация Cloud Storage для данного приложения
    const books = querySnapshot.docs.map(async (doc) => { //получаем массив всех документов (docs) и вызываем определенную функцию обратного вызова для каждого элемента массива и возвращает
      const data = doc.data(); //извлекакет все поля в документе как объект
      const uri = ref(storage, data.url); //возвращает ссылку на хранилище указанного url-адреса
      const url = await getDownloadURL(uri);   //Возвращает URL-адрес загрузки для данной ссылки на хранилище.
      const book = {  //то, что загружаем из хранилища
        name: data.name as string,
        author: data.author as string,
        price: data.price as string,
        genre: data.genre as string[],
        favorite: data.favorite as boolean,
        rating: data.rating as string,
        url: url,
        id: doc.id
      };
      return book;
    });
    return Promise.all(books); //возвращение всех массивов book ассинхронной операции
  }

  async getDataUser(user: User | null): Promise<void> {  //добавление нового пользователя в хранилище
    if (user === null) return;  //если пользователя нет, то функция завершается

    const docRef = doc(this.db, "users", user.uid);  //возвращает ссылку на документ по указанному пути, т.е. создаем коллекция для пользователей
    const docSnap = await getDoc(docRef); //получаем коллекцию пользователя из хранилища

    if (docSnap.exists()) {  //проверяем, есть ли данные или нет 
      this.dataUser = docSnap.data() as TDataUser; //то данные пользователя равны извлекаемым данным пользователя
      // console.log(docSnap.data()); //вывести данные пользователя
    } else { //если же данных нет
      const data = { //то переменной присваиваем следующие значения
        email: user.email,
        name: user.displayName,
        fotoUrl: user.photoURL,
        basket: [],
        favorite: []
      };
      await setDoc(doc(this.db, "users", user.uid), data); //записываем данные этой переменной в документ по ссылке на коллекцию
      const docSetSnap = await getDoc(docRef);  //получаем коллекцию пользователя из хранилища
      this.dataUser = docSetSnap.data() as TDataUser || null; //присваиваем пользователю данные из созданной коллекции
      console.log("create documemt");
    }
  }

  async addBookInBasket(user: User | null, book: TBook): Promise<void> { //добавление карточки книги в корзину
    if (!user || !this.dataUser) return; //если пользователь не вошел,, или пользователя нет в хранилище, то возвращаем функцию

    const index = this.dataUser.basket.findIndex(el => el.book.id === book.id); //переменной присваиваем индекс первого элемента массива, где id элемента массива basket[] равен id элемента книги
    if (index >= 0) return; //если товар есть в корзине


    const newUser = {} as TDataUser;  //создаем нового пользователя с такими же переменными как в типе TDataUser
    Object.assign(newUser, this.dataUser); //копируем переменные из переменной this.dataUser в newUser

    const bookBasket = {
      book: book,
      count: 1
    } as TBookBasket; //создаем переменную для карточки книги в корзине
    // Object.assign(bookBasket, book); // и копируем из переменной book в bookBasket такие же данные
    // bookBasket.count = 1; //количество товара в корзине изначально 0

    newUser.basket.push(bookBasket); //к новому пользователю добавляем в конец массива basket[] данные bookBasket

    await setDoc(doc(this.db, "users", user.uid), newUser) //добавляем в коллекцию в корзину пользователя данные
      .then(() => {  //если выполнено успешно
        this.dataUser = newUser; //то данные пользователя обновляются
        this.calcDataBasket();
        this.dispatch('bookInBasket', bookBasket); // подписываемся на наблюдателя, при вызове команды "bookInBasket" добавляем в коллекцию пользователя в корзину данные bookBasket
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => {

      })
  }

  async changeBookInBasket(user: User | null, bookBasket: TBookBasket): Promise<void> { //изменение количества книг в корзине
    if (!user || !this.dataUser) return;

    const index = this.dataUser.basket.findIndex((el) => el.book.id === bookBasket.book.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.basket[index] = bookBasket;

    await setDoc(doc(this.db, "users", user.uid), newUser)
      .then(() => {
        this.dataUser = newUser;
        this.calcDataBasket();
        this.dispatch("changeDataBasket", this.dataBasket);
      })
      .catch(() => { });
  }

  async delBookFromBasket(user: User | null, book: TBookBasket): Promise<void> { //добавление карточки книги в корзину
    if (!user || !this.dataUser) return; //если пользователь не вошел, или количество книг на складе равно 0, или пользователя нет в хранилище, то возвращаем функцию

    const newBasket = this.dataUser.basket.filter((el) => el.book.id !== book.book.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.basket = newBasket; //к новому пользователю добавляем в конец массива basket[] данные bookBasket

    await setDoc(doc(this.db, "users", user.uid), newUser) //добавляем в коллекцию в корзину пользователя данные
      .then(() => {  //если выполнено успешно
        this.dataUser = newUser; //то данные пользователя обновляются
        this.calcDataBasket();
        this.dispatch('delBookFromBasket', book.book.id); // подписываемся на наблюдателя, при вызове команды "delBookFromBasket" добавляем в коллекцию пользователя в корзину данные bookBasket
        this.dispatch('changeDataBasket', this.dataBasket);
      })
      .catch(() => {

      })
  }

  async addBasketInHistory(user: User | null): Promise<void> {//добавление корзины в историю
    if (!user || !this.dataUser) return;

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser)
    newUser.basket = [];

    const dataHistory = {
      basket: this.dataUser.basket,
      dataBasket: this.dataBasket,
      data: Timestamp.now()
    };

    /* try {//если товары ограничены
      await runTransaction(this.db, async (transaction) => {
        if (!this.dataUser) throw "БД отсутствует";
        const rezult = this.dataUser.basket.map(async (el) => { //асинхронная функция
          const bookRef = doc(this.db, "books", el.book.id);
          const sfBook = await transaction.get(bookRef);//найден документ
          if (!sfBook.exists()) { // проверка существования документа
          alert(`Количество товара ${el.book.name} осталось ${el.book.numbers}`)
         throw "Book does not exist!";
        }
          // const countGood=sfBook.data().numbers;   //передаем в переменную количество оставшегося товара
          // if(countGood<el.count) throw "good does not count!" //если оно меньше количества товара, которое хочет купить пользователь, то выводим ошибку
          // transaction.update(bookRef, { numbers: CountBook-el.count }); //обновление поля с количеством товара
          return Promise.resolve('ok');//возвращение состояния функции, если до сюда доходит, значит успешно
        });
        await Promise.all(rezult);//ждет, пока все ззапуски закончатся успешно
        const userRef = doc(this.db, 'users', user.uid);//получаем документ пользователя
        transaction.update(userRef, { basket: [] }); //обновляем корзину пользователя
      });
      await addDoc(collection(this.db, "users", user.uid, "history"), dataHistory)//добавляем объект в историю
      this.dataUser = newUser;
      this.calcDataBasket();
      this.dispatch('changeDataBasket', this.dataBasket);
      console.log("Transaction successfully committed!");
       } catch (e) {
      console.log("Transaction failed: ", e);
    };*/

    await addDoc(collection(this.db, 'users', user.uid, 'history'), dataHistory)
      .then(async () => {
        await setDoc(doc(this.db, 'users', user.uid), newUser)
          .then(() => {
            if (!this.dataUser) throw "БД отсутствует";
            this.dataUser.basket.forEach((el) => {
              this.dispatch('delBookFromBasket', el.book.id);
            })
            this.dispatch('addInHistory', dataHistory)
            this.dataUser = newUser;
            this.calcDataBasket();
            this.dispatch('clearBasket');
            this.dispatch('changeDataBasket', this.dataBasket);
            this.calcCountDocsHistory(user);
          })
          .catch(() => { });
      })
      .catch(() => { });
  }
  async calcCountDocsHistory(user: User | null): Promise<void> {//считает количество документов в истории
    if (!user || !this.dataUser) return;

    const querySnapshot = await getDocs(collection(this.db, "users", user.uid, "history"));
    const count = querySnapshot.docs.length;
    let summa = 0;
    querySnapshot.docs.forEach(el => {
      summa += el.data().dataBasket.allSumma;
    })
    this.dispatch('changeStat', count, summa);
  }

  async addBookInFavorite(user: User | null, book: TBook): Promise<void> { //добавление карточки книги в корзину
    if (!user || !this.dataUser) return; //если пользователь не вошел,, или пользователя нет в хранилище, то возвращаем функцию

    const index = this.dataUser.favorite.findIndex(el => el.book.id === book.id); //переменной присваиваем индекс первого элемента массива, где id элемента массива basket[] равен id элемента книги
    if (index >= 0) return; //если товар есть в корзине


    const newUser = {} as TDataUser;  //создаем нового пользователя с такими же переменными как в типе TDataUser
    Object.assign(newUser, this.dataUser); //копируем переменные из переменной this.dataUser в newUser

    const bookFavorite = {
      book: book
    } as TBookFavorite; //создаем переменную для карточки книги в корзине
    // Object.assign(bookBasket, book); // и копируем из переменной book в bookBasket такие же данные
    // bookBasket.count = 1; //количество товара в корзине изначально 0

    newUser.favorite.push(bookFavorite); //к новому пользователю добавляем в конец массива basket[] данные bookBasket

    await setDoc(doc(this.db, "users", user.uid), newUser) //добавляем в коллекцию в корзину пользователя данные
      .then(() => {  //если выполнено успешно
        this.dataUser = newUser; //то данные пользователя обновляются
        this.dispatch('bookInFavorite', bookFavorite); // подписываемся на наблюдателя, при вызове команды "bookInBasket" добавляем в коллекцию пользователя в корзину данные bookBasket
      })
      .catch(() => {

      })
  }
  async delBookFromFavorite(user: User | null, book: TBookFavorite): Promise<void> { //добавление карточки книги в корзину
    if (!user || !this.dataUser) return; //если пользователь не вошел, или количество книг на складе равно 0, или пользователя нет в хранилище, то возвращаем функцию

    const newFavorit = this.dataUser.favorite.filter((el) => el.book.id !== book.book.id);

    const newUser = {} as TDataUser;
    Object.assign(newUser, this.dataUser);
    newUser.favorite = newFavorit; //к новому пользователю добавляем в конец массива basket[] данные bookBasket

    await setDoc(doc(this.db, "users", user.uid), newUser) //добавляем в коллекцию в корзину пользователя данные
      .then(() => {  //если выполнено успешно
        this.dataUser = newUser; //то данные пользователя обновляются
        this.dispatch('delBookFromFavorite', book.book.id); // подписываемся на наблюдателя, при вызове команды "delBookFromBasket" добавляем в коллекцию пользователя в корзину данные bookBasket
      })
      .catch(() => {

      })
  }



  async getAllHistory(user: User | null): Promise<TDataHistoryWithId[]> {
    if (!user || !this.dataUser) return [];
    const querySnapshot = await getDocs(collection(this.db, 'users', user.uid, 'history'));
    const rez = querySnapshot.docs.map((doc) => {
      const data = doc.data() as TDataHistoryWithId;
      data.id = doc.id;
      return data;
    })
    return rez;
  }
}