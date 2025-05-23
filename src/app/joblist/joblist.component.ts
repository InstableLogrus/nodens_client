import { Component, inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { debounce, debounceTime, Subscription, switchMap } from 'rxjs';
import { JobService } from '../services/job.service';

import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

// penser a inclure ReactiveFormsModule  https://stackoverflow.com/a/43220824/30231852 
@Component({
    selector: 'app-joblist',
    imports: [
        MatCardModule, 
        MatListModule,
        MatInputModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
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
        
    clearSearchField() {
        this.searchField.setValue("");
    }

    updateSearchField() {
        this.jobService.getJobs(this.searchField.value ?? "").subscribe();
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
