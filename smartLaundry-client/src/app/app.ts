<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, signal } from '@angular/core';
>>>>>>> de38134 ( initialized client folder)
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
<<<<<<< HEAD
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'Laundry-Smart';
}
=======
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('smartLaundry-client');
}
>>>>>>> de38134 ( initialized client folder)
