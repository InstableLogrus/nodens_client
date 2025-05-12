import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import {Job} from '../interfaces/job.interface'

// ref: https://angular.fr/http/client

@Injectable({providedIn: 'root',})
export class JobService {
    private http = inject(HttpClient);
    public jobs = signal<Job[]>([]);
    readonly url = 'http://localhost:5000/job';

    getJobs(): Observable<Job[]> {
        return this.http.get<Job[]>(this.url).pipe(
            tap(jobs => this.jobs.set(jobs)),
            catchError(error => {
                console.log("Could not fetch job list", error);
                throw error;
            })
        )
    }
} 