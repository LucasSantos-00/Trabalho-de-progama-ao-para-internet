import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';

const DEBOUNCE_MS = 150;

/**
 * Quando o tamanho do elemento host muda, dispara um evento 'resize' na janela
 * com debounce para evitar múltiplos recálculos durante transições CSS.
 */
@Directive({
  selector: '[appResizeBroadcast]'
})
export class ResizeBroadcastDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private observer: ResizeObserver | null = null;
  private debounceId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (typeof ResizeObserver === 'undefined') return;
    this.observer = new ResizeObserver(() => {
      if (typeof window === 'undefined') return;
      if (this.debounceId !== null) clearTimeout(this.debounceId);
      this.debounceId = setTimeout(() => {
        this.debounceId = null;
        window.dispatchEvent(new Event('resize'));
      }, DEBOUNCE_MS);
    });
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.debounceId !== null) clearTimeout(this.debounceId);
    this.observer?.disconnect();
    this.observer = null;
  }
}

