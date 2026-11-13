import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';

/**
 * Diretiva equivalente à lógica global de mouseenter nos cards de serviço (originalmente em main.js)
 */
@Directive({
  selector: '[appCardHover]'
})
export class CardHoverDirective {
  private el = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }
}

