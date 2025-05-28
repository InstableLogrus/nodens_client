import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


const title = ` _______             .___                    
 \\      \\   ____   __| _/____   ____   ______
 /   |   \\ /  _ \\ / __ |/ __ \\ /    \\ /  ___/
/    |    (  <_> ) /_/ \\  ___/|   |  \\\\___ \\ 
\\____|__  /\\____/\\____ |\\___  >___|  /____  >
        \\/            \\/    \\/     \\/     \\/ `;

console.log(title);