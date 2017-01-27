import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs';
import UserModel from "../models/user.model";
import ChatModel from "../models/chat.model";
import * as firebase from 'firebase';
import { Store } from '@ngrx/store';

@Injectable()
export class ChatService {

  messages: FirebaseListObservable<ChatModel[]>;
  messagesNew: FirebaseListObservable<ChatModel[]>;
  storage;
  storageRef;
  filesRef;
  user : UserModel;

  constructor(public af: AngularFire, private store: Store<UserModel>) {
    //this.feedbacks = this.af.database.list('/messages/');

    this.storage = firebase.storage();
    this.storageRef = this.storage.ref();
    this.filesRef = this.storageRef.child('files');

    store.select('appStore').subscribe((data : UserModel) => {
      this.user = data;
      
      if(data && data.uid){
        
        this.messagesNew = this.af.database.list('/messages-new', {
          query: {
            orderByChild: 'To',
            equalTo: data.uid
          }
        });

      }
    });
  }

  fetchMessages(key){
    this.messages = this.af.database.list('/messages/' + key);
  }

  getMessageKey(key1, key2){
    if(key1 > key2){
      return key1 + key2;
    } else {
      return key2 + key1;
    }
  }


  addMessages(obj: ChatModel) {
    this.messages.push(obj);
    this.addNewMessages(obj);
  }

  deleteMessages(key: string) {    
    this.messages.remove(key); 
  }

  updateMessages(key: string, obj) {
    this.messages.update(key, obj);
  }

  addNewMessages(obj: ChatModel) {
    this.messagesNew.push(obj);
  }

  deleteNewMessages(key: string) {    
    this.messagesNew.remove(key); 
  }

  updateNewMessages(key: string, obj) {
    this.messagesNew.update(key, obj);
  }
}
