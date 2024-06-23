import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-education-certificate-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education-certificate-layout.component.html',
  styleUrl: './education-certificate-layout.component.css'
})
export class EducationCertificateLayoutComponent {
  items = [1, 2, 3, 4];
}
