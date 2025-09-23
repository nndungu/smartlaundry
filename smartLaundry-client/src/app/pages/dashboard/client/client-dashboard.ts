import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth';
import { Subscription } from 'rxjs';

export interface Order {
  id: string;
  service: string;
  date: string;
  status: string;
  statusClass: string;
  total: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-dashboard.html',
  styleUrls: ['./client-dashboard.scss']
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  userName = 'User';
  private userSubscription: Subscription = new Subscription();

  orderTableData: Order[] = [
    {
      id: 'ORD-001',
      service: 'Premium Wash & Fold',
      date: '2024-01-15',
      status: 'In Progress',
      statusClass: 'in-progress',
      total: 'KSh 2,500'
    },
    {
      id: 'ORD-002',
      service: 'Dry Cleaning',
      date: '2024-01-12',
      status: 'Completed',
      statusClass: 'completed',
      total: 'KSh 1,800'
    },
    {
      id: 'ORD-003',
      service: 'Express Service',
      date: '2024-01-10',
      status: 'Completed',
      statusClass: 'completed',
      total: 'KSh 3,200'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user && user.firstName && user.lastName) {
        this.userName = `${user.firstName} ${user.lastName}`;
      } else {
        this.userName = 'User';
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  closeModal(): void {
    // Implement modal close logic here
    console.log('Modal closed');
  }

  openSupport(): void {
    // Implement support open logic here
    console.log('Support opened');
  }

  viewOrderDetails(orderId: string): void {
    // Implement order details view logic here
    console.log('View order details:', orderId);
  }

  // Sample order progress data
  currentOrderProgress = {
    placed: { completed: true, time: '10:30 AM' },
    pickup: { completed: true, time: '2:45 PM' },
    cleaning: { active: true, completed: false, time: 'In Progress' },
    delivery: { active: false, completed: false, time: 'Pending' },
    completed: { completed: false, time: 'Pending' }
  };
}
