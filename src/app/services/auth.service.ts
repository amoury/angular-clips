import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, delay } from 'rxjs';
import { Router } from '@angular/router';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.usersCollection = this.db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map(user => !!user))
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000))
  }

  public async createUser(userData: IUser) {
    const { name, email, age, phoneNumber } = userData;

    const userCred = await this.auth.createUserWithEmailAndPassword(email as string, userData.password as string);

    if (!userCred.user) {
      throw new Error("User can't be found");
    }

    await this.usersCollection.doc(userCred.user.uid).set({ name, email, age, phoneNumber });

    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }


  public async logout($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }

    await this.auth.signOut();

    await this.router.navigateByUrl('/')
  }
}
