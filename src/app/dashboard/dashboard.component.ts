import { ApplicationInitStatus, Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JoblistComponent } from '../joblist/joblist.component';
import { JobformComponent } from '../jobform/jobform.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldControl } from '@angular/material/form-field';
import { ApplicationStatus } from '../interfaces/job.interface';
import { JobService } from '../services/job.service';


@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink, 
    JoblistComponent,
    MatButtonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  readonly dialog = inject(MatDialog);
  private jobService = inject(JobService);
  // private jobList = inject(JoblistComponent);
  @ViewChild(JoblistComponent) jobList!:JoblistComponent;

  openDialog(): void {


    const dialogRef = this.dialog.open(JobformComponent, {
      data: {
        jobTitle: 'testtitle',
        language: 'FR',
        company: 'testcompany',
        link: 'testlink',
        source: 'testsource',
        user: 'testuser',
        status: ApplicationStatus.Considered,
      },
    });



    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        console.log("result: ", result);
        this.jobService.createJob(result).subscribe(job=>{
          console.log("created: ", job);
          this.jobList.updateList(); // update list
        });
      }
    });
  }
}
