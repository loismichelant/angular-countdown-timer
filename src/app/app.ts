import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnDestroy {

  eventName = '';
  eventDate = '';
  eventTime = '';

  errorMessage = '';
  countdown: Countdown | null = null;

  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  startCountdown() {
    this.errorMessage = '';

    if (!this.eventName.trim()) {
      this.errorMessage = 'Event name is required.';
      return;
    }

    if (!this.eventDate) {
      this.errorMessage = 'Event date is required.';
      return;
    }

    const eventDateTime = this.buildEventDate();

    if (isNaN(eventDateTime.getTime())) {
      this.errorMessage = 'Invalid date or time.';
      return;
    }

    if (eventDateTime <= new Date()) {
      this.errorMessage = 'Event must be in the future.';
      return;
    }

    this.startTimer(eventDateTime);
  }

  private buildEventDate(): Date {
    if (this.eventTime) {
      return new Date(`${this.eventDate}T${this.eventTime}`);
    }

    return new Date(`${this.eventDate}T00:00`);
  }

  private startTimer(eventDate: Date) {
    this.clearTimer();
    this.updateCountdown(eventDate);

    this.intervalId = setInterval(() => {
      this.updateCountdown(eventDate);
    }, 1000);
  }

  private updateCountdown(eventDate: Date) {
  const now = Date.now();
  const distance = eventDate.getTime() - now;

  if (distance <= 0) {
    this.clearTimer();
    this.countdown = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
    alert(`${this.eventName} is happening now!`);
    this.cdr.detectChanges();
    return;
  }

  this.countdown = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };
  
  this.cdr.detectChanges();
}


  private clearTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }
}
