import { Component, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobService } from '../services/job.service';
import { Job } from '../interfaces/user.interface';

@Component({
    selector: 'app-joblist',
    imports: [],
    templateUrl: './joblist.component.html',
    styleUrl: './joblist.component.scss'
})

export class JoblistComponent {
    private readonly jobService = inject(JobService);
    jobs = this.jobService.jobs;


    ngOnInit() {
        this.jobService.getJobs().subscribe();
    }


}
