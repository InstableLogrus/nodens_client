// Job Model

export enum ApplicationStatus {
    None = "NONE",
    Read = "READ",
    Considered = "CONSIDERED",
    Sent = "SENT",
    Accepted = "ACCEPTED",
    Refused = "REFUSED",
}

export interface Job {
    id: string;
    jobTitle: string;
    language: string;
    company: string;
    link: string;
    source: string;
    user: string;
    status?: ApplicationStatus;
}