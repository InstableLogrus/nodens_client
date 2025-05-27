import { Component, inject, Injectable, OnDestroy, OnInit, Inject } from '@angular/core';
import { debounce, debounceTime, Subscription, switchMap } from 'rxjs';
import { JobService } from '../services/job.service';

import { Job } from '../interfaces/job.interface';

import {MatListModule} from '@angular/material/list';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatChipsModule} from '@angular/material/chips';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {Dialog, DialogModule, DialogRef} from '@angular/cdk/dialog';
import {DIALOG_DATA} from '@angular/cdk/dialog';


// ------------- dialog delete
@Component({
  selector: 'joblist-delete-dialog',
  templateUrl: 'joblist-delete-dialog.html',
  styleUrl: 'joblist-delete-dialog.scss',
})
export class JobListDeleteDialog {
  dialogRef = inject(DialogRef);
  constructor(@Inject(DIALOG_DATA) public data: Job) { }
}

// ------------- job list

// penser a inclure ReactiveFormsModule  https://stackoverflow.com/a/43220824/30231852 
@Component({
    selector: 'app-joblist',
    imports: [
        MatListModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        DialogModule,
    ],
    templateUrl: './joblist.component.html',
    styleUrl: './joblist.component.scss'
})

// search bar -> https://harikrishnan6336.medium.com/angular-machine-coding-autocomplete-search-bar-38718ea2fcd5

export class JoblistComponent implements OnInit, OnDestroy {
    private readonly jobService = inject(JobService);
    private subscription!: Subscription;
    jobs = this.jobService.jobs;
    isLoading = this.jobService.isLoading;

    searchField = new FormControl('');

    
    deleteDialog = inject(Dialog);
        
    clearSearchField() {
        this.searchField.setValue("");
    }

    updateList() {
        this.jobService.getJobs(this.searchField.value ?? "").subscribe();
    }

    deleteItem(job : Job) {
        console.log("deletejob: ", job.id, job);

        
        const dialogRef = this.deleteDialog.open<Job>(JobListDeleteDialog, {
            data: job,
        });
        
        dialogRef.closed.subscribe((job) => {
            console.log("deleting: ", job)
            if (!job) return;

            this.jobService.deleteJob(job.id).subscribe((result)=>{
                console.log("deleted: ", result);
                this.updateList();
            });
        })

    }

    editItem(job : Job) {
        console.log("edit item: ", job.id);
        
    }

    ngOnInit() {
        this.subscription = new Subscription();

        // initial loading of the list
        this.subscription.add(this.jobService.getJobs().subscribe());

        // query when search field is modified
        const q = this.searchField.valueChanges
            .pipe(
                debounceTime(300), // prevent hammering the server
                switchMap((input)=>this.jobService.getJobs(input as string))
            )
            .subscribe();
        this.subscription.add(q);


    }


    ngOnDestroy(): void {
        console.log("destroy!");
        this.subscription?.unsubscribe();
    }
}


