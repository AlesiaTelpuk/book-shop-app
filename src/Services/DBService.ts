import { FirebaseApp } from "firebase/app";
import { User } from "firebase/auth";
import { collection, doc, DocumentData, Firestore, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { Component } from "../Abstact/Component";
import { Observer } from "../Abstact/Observer";
import { TBook } from "../Abstact/Type";


export class DBService extends Observer {
  private db: Firestore = getFirestore(this.DBFirestore);

  dataUser: DocumentData | null = null;

  constructor(private DBFirestore: FirebaseApp) {
    super();
  }

  async getAllBooks(): Promise<TBook[]> {
    const querySnapshot = await getDocs(collection(this.db, 'book'));
    const storage = getStorage();
    const books = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();
      const uri = ref(storage, data.url);
      const url = await getDownloadURL(uri);
      const book = {
        name: data.name as string,
        author: data.author as string,
        price: data.price as number,
        genre: data.genre as string[],
        url: url
      };
      return book;
    });
    return Promise.all(books);
  }

  async getDataUser(user: User | null): Promise<void> {
    if (user === null) return;

    const docRef = doc(this.db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.dataUser = docSnap.data();
      console.log(docSnap.data());
    } else {
      const data = {
        email: user.email,
        name: user.displayName,
        fotoUrl: user.photoURL
      };
      await setDoc(doc(this.db, "users", user.uid), data);
      const docSetSnap = await getDoc(docRef);
      this.dataUser = docSetSnap.data() || null;
      console.log("create documemt");
    }
  }
}