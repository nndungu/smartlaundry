import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

export interface LaundryService {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  route?: string;
  featured?: boolean;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.scss']
})
export class ServicesComponent implements OnInit {

  services: LaundryService[] = [
    {
      id: 1,
      title: 'Premium Dry Cleaning',
      description: 'At Smart Laundry, we know that understanding fabric is key to delivering a quality service. We use the latest technology and methods to ensure that every garment entrusted to us receives the care it deserves.',
      route: '/services/premium-dry-cleaning',
      featured: true,
      imageUrl: 'assets/premium-laundry1.jpg'
    },
    {
      id: 2,
      title: 'Commercial Dry Cleaning',
      description: 'Smart Laundry specializes in premium commercial dry cleaning. We\'ve worked with several companies including, Government agencies, banks, hotels, fitness centers and hair studios.',
      route: '/services/commercial-dry-cleaning',
      imageUrl: 'assets/commercial-dry-cleaning-2.jpg'
    },
    {
      id: 3,
      title: 'Pressing Services',
      description: 'We offer quality laundry pressing & ironing services for all types of clothes with speedy pickup and delivery to your doorstep. With the help of the latest technology, we make sure to provide professional results.',
      route: '/services/pressing-services',
      imageUrl: 'assets/pressing-3.jpg'
    },
    {
      id: 4,
      title: 'Smart Repeat',
      description: 'Smart Repeat is our monthly premium service allowing you to go about your daily living without a worry about laundry, we offer a wide range of options to choose from.',
      route: '/services/smart-repeat',
      featured: true,
      imageUrl: 'assets/smart-repeat-4.jpg'
    },
    {
      id: 5,
      title: 'Free Pickup & Delivery',
      description: 'Did you know that we offer free pickup and delivery? Enjoy stress-free dry cleaning and laundry service that works around your schedule.',
      route: '/services/pickup-delivery',
      imageUrl: 'assets/free-delivery-5.jpg'
    },
    {
      id: 6,
      title: 'Wash & Fold',
      description: 'This is the best service for your everyday laundry needs. Our Wash & Fold laundry service helps you to Save 4+ hours per week.',
      route: '/services/wash-fold',
      imageUrl: 'assets/wash-fold-6.jpg'
    },
    {
      id: 7,
      title: 'Corporate Laundry',
      description: 'Smart Laundry specializes in premium commercial dry cleaning. We\'ve worked with several companies including, Government agencies, banks, hotels, fitness centers.',
      route: '/services/corporate-laundry',
      imageUrl: 'assets/offcial-wear-washing.jpg'
    },
    {
      id: 8,
      title: 'Carpet & Rugs',
      description: 'We offer quick and efficient carpet cleaning services. We use the best equipment and cleaning methods to restore the glossiness of your carpet or rug.',
      route: '/services/carpet-rugs',
      imageUrl:'assets/carpets.jpg'
    },
    {
      id: 9,
      title: 'Wedding Gown Cleaning',
      description: 'Your wedding day is one of the most special moments of your life. Keeping your wedding dress clean and preserved is an important piece of cherishing the memories of your big day.',
      route: '/services/wedding-gown',
      imageUrl: 'assets/wedding-gown-10.jpg'
    },
    {
      id: 10,
      title: 'Leather & Suede Cleaning',
      description: 'Besides our premium dry cleaning and laundry services, Smart Laundry provides unmatched leather cleaning & suede cleaning services.',
      route: '/services/leather-suede',
      imageUrl: 'assets/suede-leather-11.jpg'
    },
    {
      id: 11,
      title: 'Beddings & Duvets',
      description: 'Washing your duvets and beddings can seem like a challenge or a time-consuming task. And will it even fit in the washer? Let us handle it for you.',
      route: '/services/beddings-duvets',
      imageUrl: 'assets/beddings-duvets-13.jpg'
    },
    {
      id: 12,
      title: 'Bulky Laundry',
      description: 'From time to time, you may find yourself too busy to do your own laundry due to personal commitments or work-related arrangements. We\'re here to help.',
      route: '/services/bulky-laundry',
      imageUrl: 'assets/bulky-laundry-14.jpg'
    },
    {
      id: 13,
      title: 'Shoes',
      description: 'Smart Laundry is proud to offer shoe cleaning services that will clean and restore your shoes so they look as good as new!',
      route: '/services/shoes',
      imageUrl: 'assets/shoes-14.jpg'
    },
    {
      id: 14,
      title: 'Curtains',
      description: 'Your curtains represent the entire feel of a room. The material they are made from, the style and how they hang, and even the way they open affects the ambiance.',
      route: '/services/curtains',
      imageUrl: 'assets/curtains-16.jpg'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onServiceClick(service: LaundryService): void {
    // Handle service click - navigate to service detail
    console.log('Navigating to:', service.route);
    // You can implement router navigation here
    // this.router.navigate([service.route]);
  }

  trackByFn(index: number, service: LaundryService): number {
    return service.id;
  }
}
