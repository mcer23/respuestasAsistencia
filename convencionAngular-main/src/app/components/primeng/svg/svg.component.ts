import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

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
        const sanitizedData = DOMPurify.sanitize(data)
        this.svgContent = this.sanitizer.bypassSecurityTrustHtml(data);
        // Aplicar el color después de cargar el contenido.
        setTimeout(() => this.applyFillColor(), 0);
      },
      (error) => {
        console.error('Error al cargar el SVG:', error);
        this.svgContent='';
      }
    );
  }

  applyFillColor(): void {
    const svgElement = this.elementRef.nativeElement.querySelector('svg');
    // if (svgElement) {
    //   this.setFillRecursively(svgElement, this.fillColor);
    // }
    if(!this.isValidColor(this.fillColor)){
      console.warn(`Formato de color invalido ${this.fillColor}. Se usa 'currentColor' en su lugar.`);
      this.fillColor='currentColor';
    }
    if(svgElement){
      this.setFillRecursively(svgElement,this.fillColor);
    }
  }

  setFillRecursively(element: Element, fillColor: string): void {
    // Sobrescribir cualquier valor de fill, sin importar su valor inicial.
    element.setAttribute('fill', fillColor);

    // Eliminar estilos inline que puedan interferir.
    // element.removeAttribute('style');

    // Aplicar el color a todos los elementos hijos.
    Array.from(element.children).forEach((child) => {
      this.setFillRecursively(child, fillColor);
    });
  }
  private isValidColor(color:string):boolean{
    const hexRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;
    const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
    const rgbaRegex = /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0?\.\d+|1)\s*\)$/;
    const hslRegex = /^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/;
    const hslaRegex = /^hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*,\s*(0?\.\d+|1)\s*\)$/;
    const namedColors =['transparent','currentColor','black','white','red','green','blue','yellow','orange','purple'];

    return hexRegex.test(color)||
           rgbRegex.test(color)||
           rgbaRegex.test(color)||
           hslRegex.test(color)||
           hslaRegex.test(color)||
           namedColors.includes(color.toLowerCase());

  }
}
