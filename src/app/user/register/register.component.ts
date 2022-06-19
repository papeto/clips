import { Component} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EmailTaken } from '../validators/email-taken';
import { RegisterValidators } from '../validators/register-validators';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {
  constructor(
    private auth: AuthService,
    private emailTaken: EmailTaken
    ) 
    {}

  inSubmission = false;
  
  name= new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email= new FormControl('', [
    Validators.required,
    Validators.email
  ], [this.emailTaken.validate])
  age= new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password= new FormControl('',[
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ])
  confirmPassword= new FormControl('',[
    Validators.required,

  ])
  
  phoneNumber= new FormControl('',[
    Validators.required,
    //Validators.minLength(13),
    //Validators.maxLength(13)
  ])

  showAlert=false;
  alertMsg='Please wait, your account is being created';
  alertColor='blue'
      
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password','confirmPassword')])

  async register(){
    this.showAlert = true
    this.alertMsg = 'Please wait, your account is being created'
    this.alertColor = 'blue'
    this.inSubmission = false
    console.log(this.inSubmission)


    try{

    await this.auth.createUser(this.registerForm.value)

    } catch(err){
      console.error(err)
      this.alertMsg = 'An unexpected error occured. please try later'
      this.alertColor = 'red'
      this.inSubmission = true
      console.log(this.inSubmission)
      return
    }
    
    this.alertMsg = 'Succes! Your account has been created.'
    this.alertColor = 'green'
  }

}
