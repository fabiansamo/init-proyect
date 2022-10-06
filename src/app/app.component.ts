import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FuseinitializerService } from './services/fuseinitializer.service';
import { CONSTANT } from './constant/app.constant';

export interface initFormRequest {
  group: string;
  artifact: string;
  name: string;
  description: string;
  packageName: string;
  author: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constant = CONSTANT;
  invalidForm = false;
  projectForm !: FormGroup;

  @Input() options!: initFormRequest;

  constructor (
    private readonly fb: FormBuilder,
    private readonly toastSvc: ToastrService,
    private fuseInitializerService: FuseinitializerService
    ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      group: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_GROUP), Validators.maxLength(CONSTANT.VALIDATE_MAX_GROUP)]),
      artifact: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_ARTIFACT), Validators.maxLength(CONSTANT.VALIDATE_MAX_ARTIFACT)]),
      name: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_NAME), Validators.maxLength(CONSTANT.VALIDATE_MAX_NAME)]),
      description: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_DESCRIPTION), Validators.maxLength(CONSTANT.VALIDATE_MAX_DESCRIPTION)]),
      packageName: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_PACKAGE_NAME), Validators.maxLength(CONSTANT.VALIDATE_MAX_PACKAGE_NAME)]),
      author: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_AUTHOR), Validators.maxLength(CONSTANT.VALIDATE_MAX_AUTHOR)])
    })
  }

  onResetForm(): void {
    this.projectForm.reset();
    this.invalidForm = false;
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.toastSvc.info('The project ' + this.projectForm.value.name + ' has been created successfully.');
      console.log(JSON.stringify(this.projectForm.value));
      this.callFuseIniti();
      this.onResetForm();
    } else {
      this.invalidForm = true;
      this.toastSvc.error('Please review the fields.');
    }
  }

  callFuseIniti(): void {
      this.fuseInitializerService.getFuseInit();      
    }
  

  get group() {return this.projectForm.get('group')}
  get name() {return this.projectForm.get('name')}
  get artifact() {return this.projectForm.get('artifact')}
  get description() {return this.projectForm.get('description')}
  get packageName() {return this.projectForm.get('packageName')}
  get author() {return this.projectForm.get('author')}

  
}
