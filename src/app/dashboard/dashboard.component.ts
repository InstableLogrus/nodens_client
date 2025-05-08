import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JoblistComponent } from '../joblist/joblist.component';


@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, JoblistComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
