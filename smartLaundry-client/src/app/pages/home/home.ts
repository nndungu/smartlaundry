// home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
  // Hero Slider Properties
  heroImages = [
    {
      url: '/assets/home1.1.png',
      alt: 'Premium laundry service - Professional cleaning'
    },
    {
      url: '/assets/home1.webp',
      alt: 'Pickup and delivery service - Convenient laundry'
    },
    {
      url: '/assets/home3.jpeg',
      alt: 'Fresh clean clothes - Quality guaranteed'
    }
  ];

  currentSlideIndex = 0;
  sliderInterval: any;
  slideIntervalTime = 5000; // 5 seconds

  constructor(private router: Router) {}
  
  services = [
    {
      icon: 'fas fa-tshirt',
      title: 'Wash & Fold',
      description: 'Professional washing and folding service',
      price: '$12.99',
      features: [
        'Same-day pickup and delivery',
        'Eco-friendly detergents',
        'Sorted by fabric type',
        'Neatly folded and packaged'
      ]
    },
    {
      icon: 'fas fa-spray-can',
      title: 'Dry Cleaning',
      description: 'Expert dry cleaning for delicate garments',
      price: '$8.99',
      features: [
        'Specialized stain removal',
        'Gentle fabric care',
        'Professional pressing',
        'Protective garment bags'
      ]
    },
    {
      icon: 'fas fa-iron',
      title: 'Ironing Service',
      description: 'Crisp ironing for shirts and formal wear',
      price: '$3.99',
      features: [
        'Professional steam ironing',
        'Wrinkle-free finish',
        'Hanging or folded delivery',
        'Quick turnaround time'
      ]
    }
  ];

  features = [
    {
      icon: 'fas fa-clock',
      title: '24/7 Service',
      description: 'Schedule pickup and delivery at your convenience with our round-the-clock availability.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Insurance Covered',
      description: 'Your clothes are protected with full insurance coverage for complete peace of mind.'
    },
    {
      icon: 'fas fa-truck',
      title: 'Free Pickup & Delivery',
      description: 'Complimentary pickup and delivery service within city limits - no extra charges.'
    },
    {
      icon: 'fas fa-star',
      title: 'Quality Guarantee',
      description: '100% satisfaction guarantee or we\'ll rewash your items for free - no questions asked.'
    }
  ];

  steps = [
    {
      number: '1',
      title: 'Schedule Pickup',
      description: 'Book online or via app for convenient pickup time that works with your schedule.'
    },
    {
      number: '2',
      title: 'We Clean',
      description: 'Professional cleaning with eco-friendly products and expert care for all fabric types.'
    },
    {
      number: '3',
      title: 'Fresh Delivery',
      description: 'Clean clothes delivered fresh to your door, neatly folded or hung to your preference.'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Laundry Smart has been a game-changer for my busy schedule. The quality is excellent and the convenience is unmatched! Highly recommended for working professionals.'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Professional service, eco-friendly approach, and always on time. The pickup and delivery service is incredibly convenient. Worth every penny!'
    },
    {
      name: 'Emma Davis',
      rating: 5,
      comment: 'The dry cleaning service is outstanding. My delicate garments always come back looking brand new. Great attention to detail and customer service.'
    }
  ];

  team = [
    {
      initials: 'SJ',
      name: 'Shyllah Jepkemoi',
      role: 'CEO & Founder',
      bio: 'Provides the company\'s vision and leads UI/UX design.'
    },
    {
      initials: 'NN',
      name: 'Nelson Ndung\'u',
      role: 'Lead Backend Engineer',
      bio: 'Architects and develops all backend APIs powering the platform.'
    }
  ];

  ngOnInit(): void {
    this.setupAnimations();
    this.startSlider();
  }

  ngOnDestroy(): void {
    this.stopSlider();
  }

  // Slider Methods
  startSlider(): void {
    this.sliderInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideIntervalTime);
  }

  stopSlider(): void {
    if (this.sliderInterval) {
      clearInterval(this.sliderInterval);
    }
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroImages.length;
  }

  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.heroImages.length) % this.heroImages.length;
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    // Restart the auto-slider when user manually navigates
    this.stopSlider();
    this.startSlider();
  }

  changeSlide(direction: number): void {
    if (direction > 0) {
      this.nextSlide();
    } else {
      this.prevSlide();
    }
    // Restart the auto-slider when user manually navigates
    this.stopSlider();
    this.startSlider();
  }

  // Check if slide is active
  isSlideActive(index: number): boolean {
    return this.currentSlideIndex === index;
  }

  // Get current slide image
  getCurrentSlideImage(): string {
    return this.heroImages[this.currentSlideIndex].url;
  }

  // Get current slide alt text
  getCurrentSlideAlt(): string {
    return this.heroImages[this.currentSlideIndex].alt;
  }

  // Pause slider on hover (optional)
  pauseSlider(): void {
    this.stopSlider();
  }

  // Resume slider when not hovering (optional)
  resumeSlider(): void {
    this.startSlider();
  }

  private setupAnimations(): void {
    setTimeout(() => {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);

      document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }

  onServiceClick(service: any): void {
    console.log('Service booking clicked:', service.title);
  }

  onGetStartedClick(): void {
    this.router.navigate(['/register']);
  }

  onViewServicesClick(): void {
    this.router.navigate(['/services']);
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}