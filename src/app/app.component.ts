import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterOutlet } from '@angular/router';

// import { JobService } from './services/job.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'nodens';
  // private jobService = inject(JobService);

  // // ----- managing paste from clipboard
  // myValue = "Value";
  // pastedValue = "";

  // onPaste(event: ClipboardEvent) {
  //   navigator.clipboard
  //     .readText()
  //     .then(
  //       (cliptext) => {
  //         const linkedinRef = checkLinkedin(cliptext);
  //         console.log("pasted: ", linkedinRef);
  //         if (linkedinRef) {
  //           this.jobService.fromLinkedin(linkedinRef).subscribe(newJob=> {
  //             console.log("newjob: ", newJob);

  //           });
  //         }
  //       }
  //     )
  // }

  // ngOnInit() {
  //   // capture paste
  //   window.addEventListener("paste", this.onPaste.bind(this));
  // }

  // ngOnDestroy() {
  //   // remove capture 
  //   window.removeEventListener("paste", this.onPaste);
  // }
  
}
