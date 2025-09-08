// footer.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, 
  Droplet,
  Facebook,
  Instagram,
  Twitter,

  Sparkles,
  Building,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Send,
  Heart,
  ShieldCheck,
  Truck,
  Clock
} from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  // Brand icons
  readonly DropletIcon = Droplet;
  
  // Social media icons
  readonly FacebookIcon = Facebook;
  readonly InstagramIcon = Instagram;
  readonly TwitterIcon = Twitter;
 
  
  // Section heading icons
  readonly SparklesIcon = Sparkles;
  readonly BuildingIcon = Building;
  readonly HelpCircleIcon = HelpCircle;
  readonly MessageCircleIcon = MessageCircle;
  
  // Contact icons
  readonly PhoneIcon = Phone;
  readonly MailIcon = Mail;
  readonly MapPinIcon = MapPin;
  readonly SendIcon = Send;
  
  // Footer bottom icons
  readonly HeartIcon = Heart;
  readonly ShieldCheckIcon = ShieldCheck;
  readonly TruckIcon = Truck;
  readonly ClockIcon = Clock;

  constructor() {
    // Component initialization
  }

  // Newsletter subscription handler
  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    
    if (emailInput?.value) {
      console.log('Newsletter subscription:', emailInput.value);
      // Here you would typically call your newsletter service
      // this.newsletterService.subscribe(emailInput.value)
      
      // Show success message
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = '';
    }
  }

  // Social media click handlers
  onSocialClick(platform: string): void {
    console.log(`${platform} social link clicked`);
    // Here you would typically handle social media navigation
    // window.open(this.socialLinks[platform], '_blank');
  }

  // Contact method click handlers
  onPhoneClick(): void {
    window.location.href = 'tel:+254750972619';
  }

  onEmailClick(): void {
    window.location.href = 'mailto:hello@laundrysmart.com';
  }

  onAddressClick(): void {
    // Open Google Maps or similar
    window.open('https://maps.google.com/?q=Nairobi,Kenya', '_blank');
  }
}