import { Component, inject, Input, model } from '@angular/core';
import { FormGroup, FormsModule, FormControl, Validators, ReactiveFormsModule, StatusChangeEvent } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationStatus } from '../interfaces/job.interface';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';



interface JobData {
  id: FormControl<string | null>;
  jobTitle: FormControl<string | null>;
  language: FormControl<string | null>;
  company: FormControl<string | null>;
  link: FormControl<string | null>;
  source: FormControl<string | null>;
  user: FormControl<string | null>;
  status?: FormControl<ApplicationStatus | null>;
}

/**
 * Form to enter new or edit Job
 */

// stricted typed form https://angular.dev/guide/forms/typed-forms

@Component({
  selector: 'app-jobform',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './jobform.component.html',
  styleUrl: './jobform.component.scss'
})
export class JobformComponent {
  readonly dialogRef = inject(MatDialogRef<JobformComponent>);
  readonly data = inject<JobData>(MAT_DIALOG_DATA);
  readonly job = model(this.data);
  
  

  applicationStatusList: string[] = [...Object.values(ApplicationStatus)];

  jobForm = new FormGroup<JobData>({
    id: new FormControl(this.data?.id ?? ""),
    jobTitle: new FormControl(this.data?.jobTitle ?? "", { validators: [Validators.required] }),
    language: new FormControl(this.data?.language ?? ""),
    company: new FormControl(this.data?.company ?? "", { validators: [Validators.required] }),
    link: new FormControl(this.data?.link ?? "", { validators: [Validators.required] }),
    source: new FormControl(this.data?.source ?? ""),
    user: new FormControl(this.data?.user ?? "", { validators: [Validators.required] }),
    status: new FormControl(this.data?.status ?? ApplicationStatus.None),
  });

  get formData() {
    return this.jobForm.value;
  }

  onSubmit(): void {
    console.log("submit", this.jobForm.value);
    this.dialogRef.close(this.jobForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
