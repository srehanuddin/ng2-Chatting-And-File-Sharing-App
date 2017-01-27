import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { Store } from '@ngrx/store';
import { AccountsService } from '../../services/accounts.service';
import UserModel, { UserType } from "../../models/user.model";
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

  constructor(
    private accountService : AccountsService, 
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

  ngOnInit() {
  }

  delete(key : string){
    console.log("key : ", key);
    this.accountService.deleteAccount(key)
  }
}
