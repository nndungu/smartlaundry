import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Droplet } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  readonly DropletIcon = Droplet;
}
