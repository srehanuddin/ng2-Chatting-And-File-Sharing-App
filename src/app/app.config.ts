import { AuthProviders, AuthMethods } from 'angularfire2';

// Must export the config
export const firebaseConfig = {
  apiKey: 'AIzaSyCJhzcObPNZYVEbiiWEgzKOlUPF_n-U6zc',
  authDomain: 'ng2-chattingwithimagesharing.firebaseio.com',
  databaseURL: 'https://ng2-chattingwithimagesharing.firebaseio.com',
  storageBucket: 'gs://ng2-chattingwithimagesharing.appspot.com',
  messagingSenderId: '<your-messaging-sender-id>'
};

export const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};