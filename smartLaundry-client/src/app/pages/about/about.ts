// about.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../../pages/about/about.html',
  styleUrls: ['../../pages/about/about.scss']
})
export class AboutComponent implements OnInit {

  stats = [
    {
      number: '10,000+',
      label: 'Happy Customers',
      animatedNumber: 10000,
      suffix: 'k+'
    },
    {
      number: '50,000+',
      label: 'Orders Completed',
      animatedNumber: 50000,
      suffix: 'k+'
    },
    {
      number: '4.9★',
      label: 'Average Rating',
      animatedNumber: 4.9,
      suffix: '★'
    },
    {
      number: '24h',
      label: 'Turnaround Time',
      animatedNumber: 24,
      suffix: 'h'
    }
  ];

  values = [
    {
      icon: 'fas fa-award',
      title: 'Quality',
      description: 'We never compromise on the quality of our cleaning services. Every item receives meticulous attention and care.'
    },
    {
      icon: 'fas fa-users',
      title: 'Customer First',
      description: 'Your satisfaction is our top priority. We listen, adapt, and continuously improve based on your feedback.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Care',
      description: 'We treat your garments with the same care and attention as if they were our own precious belongings.'
    },
    {
      icon: 'fas fa-bullseye',
      title: 'Innovation',
      description: 'We constantly improve our processes and embrace new technology to serve you better every day.'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Sustainability',
      description: 'Environmental responsibility is at our core. We use eco-friendly products and sustainable practices.'
    },
    {
      icon: 'fas fa-handshake',
      title: 'Integrity',
      description: 'We build trust through transparency, honesty, and delivering on our promises consistently.'
    }
  ];


  ngOnInit(): void {
    this.setupAnimations();
    this.setupStatsAnimation();
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

  private setupStatsAnimation(): void {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    });

    setTimeout(() => {
      const statsCard = document.querySelector('.stats-card');
      if (statsCard) {
        statsObserver.observe(statsCard);
      }
    }, 100);
  }

  private animateStats(): void {
    const statElements = document.querySelectorAll('.stat-number');
    
    this.stats.forEach((stat, index) => {
      const element = statElements[index];
      if (element) {
        this.animateCounter(element, stat.animatedNumber, stat.suffix);
      }
    });
  }

  private animateCounter(element: Element, target: number, suffix: string): void {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      if (suffix === '★') {
        element.textContent = current.toFixed(1) + suffix;
      } else if (suffix === 'h') {
        element.textContent = Math.ceil(current) + suffix;
      } else if (suffix === 'k+') {
        element.textContent = Math.ceil(current / 1000) + suffix;
      } else {
        element.textContent = Math.ceil(current).toString();
      }
    }, 20);
  }
}