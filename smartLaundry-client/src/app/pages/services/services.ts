// services.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl:  './services.html',
  styleUrls: ['./services.scss'],
})
export class ServicesComponent implements OnInit {

  services = [
    {
      image:'assets/images/wash-fold.jpg',
      alt: 'Wash and Fold Service',
      icon: 'fas fa-tshirt',
      title: 'Wash & Fold',
      description: 'Professional washing and folding service',
      price: '$12.99',
      priceUnit: 'per load',
      features: [
        'Same-day pickup and delivery',
        'Eco-friendly detergents',
        'Sorted by fabric type',
        'Neatly folded and packaged',
        'Stain pre-treatment included',
        'Fresh scent or fragrance-free'
      ]
    },
    {
      image:'assets/images/dry-cleaning.jpg',
      alt: 'Dry Cleaning Service',
      icon: 'fas fa-spray-can',
      title: 'Dry Cleaning',
      description: 'Expert dry cleaning for delicate garments',
      price: '$8.99',
      priceUnit: 'per item',
      features: [
        'Specialized stain removal',
        'Gentle fabric care',
        'Professional pressing',
        'Protective garment bags',
        'Wedding dress cleaning',
        'Leather and suede care'
      ]
    },
    {
      image: 'assets/images/laundry-iron.jpg',
      alt: 'Ironing Service',
      icon: 'fas fa-iron',
      title: 'Ironing Service',
      description: 'Crisp ironing for shirts and formal wear',
      price: '$3.99',
      priceUnit: 'per item',
      features: [
        'Professional steam ironing',
        'Wrinkle-free finish',
        'Hanging or folded delivery',
        'Quick turnaround time',
        'Shirt pressing specialty',
        'Uniform pressing available'
      ]
    }
  ];

  additionalServices = [
    {
      icon: 'fas fa-clock',
      title: 'Express Service',
      description: 'Need it fast? Get your laundry back in 4 hours with our express service for urgent needs.',
      price: '+$5.00'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Premium Care',
      description: 'Special handling for luxury items and delicate fabrics with extra attention and care.',
      price: '+$3.00'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Stain Treatment',
      description: 'Professional stain removal for tough spots, wine, grease, ink, and other difficult stains.',
      price: '$2.99'
    },
    {
      icon: 'fas fa-award',
      title: 'Alterations',
      description: 'Professional tailoring and alteration services including hemming, fitting, and repairs.',
      price: 'From $15.00'
    },
    {
      icon: 'fas fa-home',
      title: 'Household Items',
      description: 'Cleaning for bedding, curtains, comforters, pillows, and other household textiles.',
      price: 'From $8.99'
    },
    {
      icon: 'fas fa-shoe-prints',
      title: 'Shoe Care',
      description: 'Professional shoe cleaning and restoration services for leather, suede, and fabric shoes.',
      price: 'From $12.99'
    }
  ];

  processSteps = [
    {
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Sorting and Inspection',
      number: '1',
      title: 'Sorting & Inspection',
      description: 'Every item is carefully sorted by fabric type, color, and care instructions. We inspect for stains and special requirements.'
    },
    {
      image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Professional Washing',
      number: '2',
      title: 'Professional Washing',
      description: 'State-of-the-art machines and eco-friendly detergents ensure thorough cleaning while protecting fabric integrity.'
    },
    {
      image: 'https://images.unsplash.com/photo-1521335752418-7b4eef3ffe45?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Drying and Care',
      number: '3',
      title: 'Drying & Care',
      description: 'Proper drying techniques preserve fabric quality. Delicate items receive special air-drying treatment.'
    },
    {
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      alt: 'Folding and Packaging',
      number: '4',
      title: 'Folding & Packaging',
      description: 'Expert folding and packaging ensures your clothes arrive fresh, wrinkle-free, and ready to wear.'
    }
  ];

  serviceFeatures = [
    {
      icon: 'fas fa-check-circle',
      title: 'Quality Assured',
      description: 'Every item is carefully inspected before delivery to ensure the highest standards.'
    },
    {
      icon: 'fas fa-clock',
      title: 'On-Time Delivery',
      description: 'We guarantee delivery within your chosen time window or your money back.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Damage Protection',
      description: 'Full insurance coverage for complete peace of mind with every order.'
    },
    {
      icon: 'fas fa-award',
      title: 'Expert Care',
      description: 'Trained professionals with years of experience handle your precious garments.'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Eco-Friendly',
      description: 'Environmentally safe cleaning products and energy-efficient processes.'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Easy Booking',
      description: 'Simple online booking system with real-time tracking and notifications.'
    }
  ];

  ngOnInit(): void {
    this.setupAnimations();
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

  onServiceBook(service: any): void {
    console.log('Service booking clicked:', service.title);
  }
}