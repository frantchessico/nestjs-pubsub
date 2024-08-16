
import { Injectable, Inject } from '@nestjs/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore, Firestore, addDoc, collection, serverTimestamp, query,
  orderBy, where, onSnapshot, updateDoc, doc
} from 'firebase/firestore';

@Injectable()
export class PubSubService {
  private firestoreInstance: Firestore | null = null;

  constructor(@Inject('FIREBASE_CONFIG') private readonly firebaseConfig: object) {
    const app: FirebaseApp = initializeApp(this.firebaseConfig);
    this.firestoreInstance = getFirestore(app);
  }

  private getFirestoreInstance(): Firestore {
    if (!this.firestoreInstance) {
      throw new Error('Firestore não inicializado.');
    }
    return this.firestoreInstance;
  }

  async publish(channel: string, message: string, subscribers: string[]): Promise<void> {
    const firestore = this.getFirestoreInstance();
    for (const subscriber of subscribers) {
      await addDoc(collection(firestore, 'channels', channel, 'messages'), {
        message,
        timestamp: serverTimestamp(),
        read: false,
        subscriber
      });
      console.log(`Mensagem publicada no canal ${channel} para ${subscriber}: ${message}`);
    }
  }

  subscribe(channel: string, subscriberIds: string[], onMessage: (message: string) => void): void {
    const firestore = this.getFirestoreInstance();
    subscriberIds.forEach((subscriberId) => {
      const messagesRef = collection(firestore, 'channels', channel, 'messages');
      const q = query(
        messagesRef,
        orderBy('timestamp'),
        where('read', '==', false),
        where('subscriber', '==', subscriberId)
      );
      onSnapshot(q, async (snapshot) => {
        for (const change of snapshot.docChanges()) {
          if (change.type === 'added') {
            const messageData = change.doc.data();
            console.log(`Recebida mensagem do canal ${channel} por ${subscriberId}: ${messageData.message}`);
            try {
              await updateDoc(doc(firestore, 'channels', channel, 'messages', change.doc.id), { read: true });
              onMessage(messageData.message);
            } catch (error) {
              console.error(`Erro ao processar a mensagem com ID ${change.doc.id}:`, error);
            }
          }
        }
      }, (err) => {
        console.error('Erro ao escutar mensagens:', err);
      });
    });
  }
}
