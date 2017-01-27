import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Subject } from 'rxjs';
import UserModel from "../models/user.model";
import ChatModel from "../models/chat.model";

@Injectable()
export class ChatService {

  messages: FirebaseListObservable<ChatModel[]>;

  constructor(public af: AngularFire) {
    //this.feedbacks = this.af.database.list('/messages/');
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


  addMessages(job: ChatModel) {
    this.messages.push(job);
  }

  deleteMessages(key: string) {    
    this.messages.remove(key); 
  }

  updateMessages(key: string, obj) {
    this.messages.update(key, obj);
  }

  addNewMessages(job: ChatModel) {
    this.messages.push(job);
  }

  deleteNewMessages(key: string) {    
    this.messages.remove(key); 
  }

  updateNewMessages(key: string, obj) {
    this.messages.update(key, obj);
  }
}
