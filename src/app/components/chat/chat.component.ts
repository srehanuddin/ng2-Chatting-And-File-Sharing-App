import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { Store } from '@ngrx/store';
import { AccountsService } from '../../services/accounts.service';
import { ChatService } from '../../services/chat.service';
import UserModel, { UserType } from "../../models/user.model";
import ChatModel from "../../models/chat.model";
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  accounts : FirebaseListObservable<UserModel[]>;
  accountsArr : UserModel[];
  user : UserModel;
  selectedUser : UserModel;
  messages : ChatModel[];

  constructor(
    private accountService : AccountsService, 
    private chatService : ChatService, 
    private store: Store<UserModel>,
    private router: Router,
    ) {

    //accountService.fetchAccounts(UserType.User)
    accountService.fetchAccounts(null);
    this.accounts = accountService.accounts;

    store.select('appStore').subscribe((data : UserModel) => {
      this.user = data;
      
      if(!(data && data.uid)){
        this.router.navigate(['/Login']);
        return;
      }
    });

    this.accounts.subscribe((data : UserModel[]) => {
      this.accountsArr = data;
      console.log("Users" , this.accountsArr);
    });

  }

  messgesSubscribe(){
      this.chatService.messages.subscribe(data => {
        console.log("data", data);
        this.messages = data;
      })
  }

  selectUser(u : UserModel){
    
    this.selectedUser = u;

    let key1 = this.user.uid;
    let key2 = u.uid;
    let msgKey = this.chatService.getMessageKey(key1, key2);
    this.chatService.fetchMessages(msgKey);
    this.messgesSubscribe();
  }

  sendMessage(message){
    if(message.value){

      var Obj : ChatModel = {
        Text : message.value,
        To : this.selectedUser.uid,
        From : this.user.uid,
        TimeStamp : Date.now(),
        IsRead : false
      }
      this.chatService.addMessages(Obj);
      message.value = "";
    }
  }

  ngOnInit() {
  }

  delete(key : string){
    console.log("key : ", key);
    this.accountService.deleteAccount(key)
  }
}
