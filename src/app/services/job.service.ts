import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
import {Job} from '../interfaces/job.interface'
import { FormControl } from '@angular/forms';

// ref: https://angular.fr/http/client

// loading indicator https://blog.angular-university.io/angular-loading-indicator/

@Injectable({providedIn: 'root',})
export class JobService {
    private http = inject(HttpClient);
    public jobs = signal<Job[]>([]);
    public isLoading = signal<boolean>(false);

    readonly url = 'http://localhost:5000/job';
    
    searchField = new FormControl('');

    // API to get list of jobs (with filters)
    getJobs(query:string = ""): Observable<Job[]> {
        this.isLoading.set(true);
        const query_url = `${this.url}/?query=${query}`;
        return this.http
            .get<Job[]>(query_url)
            .pipe(
                tap(jobs => {
                    this.jobs.set(jobs);
                    this.isLoading.set(false);
                }),
                catchError(error => {
                    this.isLoading.set(false);
                    throw error;
                })
            )
    }

    // API to create a new job
    createJob(job:Omit<Job, 'id'>): Observable<Job> {
        const api_url = `${this.url}/`;
        this.isLoading.set(true);
        return this.http
            .post<Job>(api_url, job)
            .pipe(
                tap(job=> {
                    this.isLoading.set(false);
                }),
                catchError(error=> {
                    this.isLoading.set(false);
                    throw error;
                })
            );

    }
} 