import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [],
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent implements OnInit, AfterViewInit {
  @Input() path!: string;       
  @Input() fillColor: string = 'currentColor';  
  svgContent: SafeHtml = '';    

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadSvg();
  }

  ngAfterViewInit(): void {
    // Usar setTimeout para asegurar que el contenido del SVG está disponible.
    setTimeout(() => {
      this.applyFillColor();
    }, 0);
  }

  loadSvg(): void {
    this.http.get(this.path, { responseType: 'text' }).subscribe(
      (data: string) => {
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(data);
        // Aplicar el color después de cargar el contenido.
        setTimeout(() => this.applyFillColor(), 0);
      },
      (error) => {
        console.error('Error al cargar el SVG:', error);
      }
    );
  }

  applyFillColor(): void {
    const svgElement = this.elementRef.nativeElement.querySelector('div svg');
    if (svgElement) {
      this.setFillRecursively(svgElement, this.fillColor);
    }
  }

  setFillRecursively(element: Element, fillColor: string): void {
    // Sobrescribir cualquier valor de fill, sin importar su valor inicial.
    element.setAttribute('fill', fillColor);

    // Eliminar estilos inline que puedan interferir.
    element.removeAttribute('style');

    // Aplicar el color a todos los elementos hijos.
    Array.from(element.children).forEach((child) => {
      this.setFillRecursively(child, fillColor);
    });
  }
}
