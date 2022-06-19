import { Component, OnInit, OnDestroy, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import Iclip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip: Iclip | null = null
  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg = 'Please wait! Updating Clip'
  
  @Output() update = new EventEmitter()

clipID = new FormControl('')
title = new FormControl('', [
  Validators.required,
  Validators.minLength(3)
])
editForm = new FormGroup({
  title: this.title,
  id: this.clipID
})

  constructor(
    private modal: ModalService,
    private clipservice: ClipService
  ) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }

  ngOnDestroy(): void{
    this.modal.unregister('editClip')
  }

  ngOnChanges(): void {
    if(!this.activeClip){
      return
    }
    this.showAlert = false
    this.inSubmission = false
    this.clipID.setValue(this.activeClip.docID)
    this.title.setValue(this.activeClip.title)
  }

  async submit(){
    if(!this.activeClip){
      return
    }

    this.inSubmission = true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = ' Please wait! Updating Clip.'
    
    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)


    try {
      await this.clipservice.updateClip(
        this.clipID.value, this.title.value)
    }
    catch(e){
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg = ' try again later'
      return
    }

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = ' Success! '
  }



}
