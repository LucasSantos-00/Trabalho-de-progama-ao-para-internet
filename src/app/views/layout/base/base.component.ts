import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { ResizeBroadcastDirective } from '../../../core/directives/resize-broadcast.directive';

@Component({
  selector: 'app-base',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ResizeBroadcastDirective
  ],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit, OnDestroy {
  isLoading = false;
  isScrolled = false;

  private router = inject(Router);
  private loadingCount = 0;
  private routerEventsSub?: Subscription;

  ngOnInit(): void {
    // Spinner for lazy loading modules (loadChildren chunks)
    this.routerEventsSub = this.router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        this.loadingCount++;
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingCount--;
        this.isLoading = this.loadingCount > 0;
      }
    });

    this.onWindowScroll();
  }

  ngOnDestroy(): void {
    this.routerEventsSub?.unsubscribe();
  }

  // Lógica para esconder o botão de descida após rolar a tela (equivalente ao main.js)
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 300;
    }
  }
}

