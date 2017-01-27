import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { Store } from '@ngrx/store';
import { AccountsService } from '../../services/accounts.service';
import { ChatService } from '../../services/chat.service';
import UserModel, { UserType } from "../../models/user.model";
import ChatModel from "../../models/chat.model";
import { Router } from '@angular/router';
import * as firebase from 'firebase';

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
  progress: number = 0;
  isFileUploading = false;
  message : String;

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
    if(this.selectedUser && this.selectedUser.uid == u.uid){
      return;
    }
    
    this.selectedUser = u;

    let key1 = this.user.uid;
    let key2 = u.uid;
    let msgKey = this.chatService.getMessageKey(key1, key2);
    this.chatService.fetchMessages(msgKey);
    this.messgesSubscribe();
  }

  sendMessage(){
    if(this.message){

      var Obj : ChatModel = {
        Text : this.message,
        To : this.selectedUser.uid,
        From : this.user.uid,
        TimeStamp : Date.now(),
        IsRead : false
      }
      this.chatService.addMessages(Obj);
      this.message = "";
    }
  }

  fileChanged(event){

    var self = this;

    var files = event.srcElement.files[0];
    console.log(files);
    if(!files){
      return;
    }

    self.progress = 0;
    self.isFileUploading = true;

    var filesRef = this.chatService.filesRef;

    var metadata = {
      contentType: files.type,
    };
    
    var fileName = Date.now() + "-" + files.name;
    var spaceRef = filesRef.child(fileName);

    // File path is 'images/space.jpg'
    var path = spaceRef.fullPath;

    var uploadTask = this.chatService.storageRef.child(path).put(files, metadata);

    // File name is 'space.jpg'
    var name = spaceRef.name

    uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      self.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + self.progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log("downloadURL", downloadURL);
      
      self.progress = 0;
      self.isFileUploading = false;

       var Obj : ChatModel = {
        To : self.selectedUser.uid,
        From : self.user.uid,
        TimeStamp : Date.now(),
        IsRead : false,
        Url : downloadURL
      }
      self.chatService.addMessages(Obj);

    });
  }

  ngOnInit() {
  }

  delete(key : string){
    console.log("key : ", key);
    this.accountService.deleteAccount(key)
  }
}
