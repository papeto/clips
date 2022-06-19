import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { delay, Observable, of} from 'rxjs';
import Iuser from '../models/user.model';
import { map, filter, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersColletion: AngularFirestoreCollection<Iuser>
  public isAuthenticated$: Observable<boolean>
  public isAuthenticatedWithDelay$: Observable<boolean>
  private redirect = false


  constructor(    
    private auth:AngularFireAuth,
    private db:AngularFirestore,
    private router: Router,
    private route: ActivatedRoute) {

      this.usersColletion = db.collection('user')
      this.isAuthenticated$ = auth.user.pipe(
        map(user => !!user)
      )
      this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
        delay(1000)
      )
      
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => this.route.firstChild),
        switchMap(route => route?.data?? of({}))
      ).subscribe(data =>{
        this.redirect = data.authOnly ?? false
      })
     }

  public async createUser(userData: Iuser){
    if(!userData.password){
      throw new Error("Password not Provided");
      
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    )
 console.log({userCred})
    if (!userCred.user) {
      throw new Error("User can't be found");
    }
       await this.usersColletion.doc(userCred.user.uid).set({
        name: userData.name,
        email: userData.email,
        age: userData.age,
        phoneNumber: userData.phoneNumber
      })
    
      await userCred.user.updateProfile({
        displayName: userData.name
      })
  }
  public async logout($event?: Event){
    if($event){
      $event.preventDefault()
    }
    await this.auth.signOut()
    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
  }
}
