import { Component, inject, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { JobService } from '../services/job.service';

import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';


@Component({
    selector: 'app-joblist',
    imports: [
        MatCardModule, 
        MatListModule,
    ],
    templateUrl: './joblist.component.html',
    styleUrl: './joblist.component.scss'
})

export class JoblistComponent {
    private readonly jobService = inject(JobService);
    private subscription!: Subscription;
    jobs = this.jobService.jobs;


    ngOnInit() {
        this.subscription = this.jobService.getJobs().subscribe();
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
