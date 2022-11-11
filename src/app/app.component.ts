import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FuseinitializerService } from './services/fuseinitializer.service';
import { CONSTANT } from './constant/app.constant';

declare var window:any;

export interface initFormRequest {
  group: string;
  artifact: string;
  name: string;
  description: string;
  packageName: string;
  author: string;
}

export interface operationRestDetail {
  id: string;
  method: string;
  name: string;
}

interface operationRestDetailItems extends Array<operationRestDetail>{}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constant = CONSTANT;
  invalidForm = false;
  invalidRestForm = false;
  invalidKafkaForm = false;
  projectForm !: FormGroup;
  modalRestForm !: FormGroup;
  modalKafkaForm !: FormGroup;
  modalDependenciesForm !: FormGroup;
  restModal:any;
  kafkaModal:any;
  dependenciesModal:any;
  operationTypeList : any = CONSTANT.METHOD_HTTP;
  kafkaEventList : any = CONSTANT.EVENT_KAFKA;
  dependenciesList : any = CONSTANT.EXTRA_DEPENDENCIES;
  @Input() options!: initFormRequest;

  constructor (
    private readonly fb: FormBuilder,
    private readonly toastSvc: ToastrService,
    private fuseInitializerService: FuseinitializerService
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.initRestModal();
    this.initKafkaModal();
    this.initDependenciesModal();
  }

  private initForm(): void {
    this.projectForm = this.fb.group({
      group: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_GROUP), Validators.maxLength(CONSTANT.VALIDATE_MAX_GROUP)]),
      artifact: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_ARTIFACT), Validators.maxLength(CONSTANT.VALIDATE_MAX_ARTIFACT)]),
      name: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_NAME), Validators.maxLength(CONSTANT.VALIDATE_MAX_NAME)]),
      description: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_DESCRIPTION), Validators.maxLength(CONSTANT.VALIDATE_MAX_DESCRIPTION)]),
      packageName: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_PACKAGE_NAME), Validators.maxLength(CONSTANT.VALIDATE_MAX_PACKAGE_NAME)]),
      author: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_AUTHOR), Validators.maxLength(CONSTANT.VALIDATE_MAX_AUTHOR)])
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid && this.modalRestForm.valid) {            
      this.toastSvc.info('The project ' + this.projectForm.value.name + ' has been created successfully.');      
      const req = this.generateRequest();
      console.log("print request::::: " + req);
      this.callFuseIniti();
      this.ngOnInit();
    } else {
      this.invalidForm = true;
      this.toastSvc.error('Please review the fields.');
      if (this.modalRestForm.invalid) {
        this.invalidRestForm = true;
        this.modalRestForm.updateValueAndValidity();
      }
    }
  }

  callFuseIniti(): void {
    this.fuseInitializerService.getFuseInit();      
  }

  onResetForm(): void {
    this.projectForm.reset();
    this.invalidForm = false;
    this.modalRestForm.reset();
    this.invalidRestForm = false;
  }

  generateRequest(): string {
     
    const objreq = new FormGroup({
      project: this.projectForm,
      rest: this.modalRestForm,
      kafka: this.modalKafkaForm,
      dependencies: this.modalDependenciesForm
    });
    console.log('init print: ' + JSON.stringify(objreq.value));
    
    return (JSON.stringify(objreq.value));
    


  }

  get group() {return this.projectForm.get('group')}
  get name() {return this.projectForm.get('name')}
  get artifact() {return this.projectForm.get('artifact')}
  get description() {return this.projectForm.get('description')}
  get packageName() {return this.projectForm.get('packageName')}
  get author() {return this.projectForm.get('author')}

    // MODAL REST //

  private initFormRest() {
    this.modalRestForm = new FormGroup({
      apiName: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_REST_API_NAME), Validators.maxLength(CONSTANT.VALIDATE_MAX_REST_API_NAME)]),
      operations: new FormArray([this.operationRestFields()], [Validators.required])
    });
  }

  resetRestModal() {
    this.initFormRest();
    this.invalidRestForm = false;
  }

  //Append Fields Set
  private operationRestFields(): FormGroup {
    return new FormGroup({
      methodName: new FormControl('GET', [Validators.required]),
      operationName: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_REST_OPERATION_NAME), Validators.maxLength(CONSTANT.VALIDATE_MAX_REST_OPERATION_NAME)]),
    });
  }

  //add new operation rest
  addOperationRest() {
    const arrayOperations = this.modalRestForm.get('operations') as FormArray;
    arrayOperations.push(this.operationRestFields());
  }

  //remove operation rest
  removeOperationRest(index: number) {
    const arrayOperations = this.modalRestForm.get('operations') as FormArray;
    arrayOperations.removeAt(index);
  }


  //get control from form
  getCtrl(key: string, form: FormGroup): any {
    return form.get(key)
  }

  get operations(): FormArray {return this.modalRestForm.get('operations') as FormArray}
  get formRestDetails(): FormGroup {return this.modalRestForm as FormGroup}

  private initRestModal() : void {
    this.initFormRest();
    this.restModal = new window.bootstrap.Modal(
      document.getElementById("restModal")
    )
  }

  openRestModal() {
    this.restModal.show();
  }

  closeRestModal() {
    this.restModal.hide();
  }

  onSubmitRestModal() {
    if (this.modalRestForm.valid) {
      this.toastSvc.info('The rest fields are correct.');
      console.log('Salida Rest' + JSON.stringify(this.modalRestForm.value));
      this.closeRestModal();
    } else {
      this.invalidRestForm = true;
      this.toastSvc.error('Please review the REST fields.');
      console.log(this.modalRestForm.errors);
      JSON.stringify(this.modalRestForm.value);
    }
  }

  // end modal rest

  // Modal KAFKA //

    private initKafkaModal() : void {
      this.initFormKafka();
      this.kafkaModal = new window.bootstrap.Modal(
        document.getElementById("kafkaModal")
      )
    }

    //Append Fields Set
    private kafkaFields(): FormGroup {
      return new FormGroup({
        eventKafka: new FormControl('CONSUMER', [Validators.required]),
        topicName: new FormControl('', [Validators.required, Validators.minLength(CONSTANT.VALIDATE_MIN_KAFKA_TOPIC_NAME), Validators.maxLength(CONSTANT.VALIDATE_MAX_KAFKA_TOPIC_NAME)]),
      });
    }

    private initFormKafka() {
      this.modalKafkaForm = new FormGroup({
        events: new FormArray([])
      });
    }

    openKafkaModal() {
      this.kafkaModal.show();
    }
  
    closeKafkaModal() {
      this.kafkaModal.hide();
    }

    onSubmitKafkaModal() {
      if (this.modalKafkaForm.valid) {
        this.toastSvc.info('The KAFKA fields are correct.');
        console.log('Salida Rest' + JSON.stringify(this.modalKafkaForm.value));
        this.closeKafkaModal();
      } else {
        this.invalidKafkaForm = true;
        this.toastSvc.error('Please review the KAFKA fields.');
        console.log(this.modalKafkaForm.errors);
        JSON.stringify(this.modalKafkaForm.value);
      }
    }

    addEventKafka() {
      const arrayEvents = this.modalKafkaForm.get('events') as FormArray;
      arrayEvents.push(this.kafkaFields());
    }

    //remove operation rest
    removeEventKafka(index: number) {
      const arrayEvents = this.modalKafkaForm.get('events') as FormArray;
      arrayEvents.removeAt(index);
    }

    get events(): FormArray {return this.modalKafkaForm.get('events') as FormArray}

    resetKafkaModal() {
      this.initFormKafka();
      this.invalidKafkaForm = false;
    }

    //end modal kafka

    // modal extra dependecies

    private initDependenciesModal() : void {
      this.initFormDependencies();
      this.dependenciesModal = new window.bootstrap.Modal(
        document.getElementById("dependenciesModal")
      )
    }

    private initFormDependencies() {
      this.modalDependenciesForm = new FormGroup({
        dependencies: new FormControl([])
      });
    }

    //Append Fields Set
    private dependencyFields(): FormGroup {
      return new FormGroup({
        name: new FormControl()
      });
    }

    openDependenciesModal() {
      this.dependenciesModal.show();
    }
  
    closeDependenciesModal() {
      this.dependenciesModal.hide();
    }

    onSubmitDependenciesModal() {
      if (this.modalDependenciesForm.valid) {
        this.toastSvc.info('The Dependencies fields are correct.');
        console.log('Salida Dependencies' + JSON.stringify(this.modalDependenciesForm.value));
        this.closeDependenciesModal();
      } else {
        this.toastSvc.error('Please review the Dependencies fields.');
        console.log(this.modalDependenciesForm.errors);
        JSON.stringify(this.modalDependenciesForm.value);
      }
    }

    get dependencies() { return this.modalDependenciesForm.get('dependencies') as FormControl } 

    resetDependenciesModal() {
      this.initFormDependencies();
    }


    // end extra dependecies

}
