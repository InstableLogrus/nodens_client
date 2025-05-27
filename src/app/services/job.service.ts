import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, pipe, tap } from 'rxjs';
import { Job } from '../interfaces/job.interface'
import { FormControl } from '@angular/forms';

// ref: https://angular.fr/http/client

// loading indicator https://blog.angular-university.io/angular-loading-indicator/

interface API_Answer {
    status: string;
    id?: string
}

@Injectable({ providedIn: 'root', })
export class JobService {
    private http = inject(HttpClient);
    public jobs = signal<Job[]>([]);
    public isLoading = signal<boolean>(false);

    readonly url = 'http://localhost:5000/job';

    searchField = new FormControl('');

    // API to get list of jobs (with filters)
    getJobs(query: string = ""): Observable<Job[]> {
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
    createJob(job: Omit<Job, 'id'>): Observable<Job> {
        const api_url = `${this.url}/`;
        this.isLoading.set(true);
        return this.http
            .post<Job>(api_url, job)
            .pipe(
                tap(job => {
                    this.isLoading.set(false);
                }),
                catchError(error => {
                    this.isLoading.set(false);
                    throw error;
                })
            );

    }

    // API to delete job
    deleteJob(jobId: string): Observable<API_Answer> {
        const api_url = `${this.url}/${jobId}`;
        // const obj = { id: jobId };
        this.isLoading.set(true);
        // const options = {
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/json',
        //     }),
        //     body: obj
        // }
 
        return this.http
            .delete<API_Answer>(api_url)
            .pipe(
                tap(result => {
                    this.isLoading.set(false);
                }),
                catchError(error => {
                    this.isLoading.set(false);
                    throw error;
                })
            )
    }
} 