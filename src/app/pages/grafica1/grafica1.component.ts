import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: ['./grafica1.component.css']
})
export class Grafica1Component implements OnInit {

  public labels1: string[] = ['Pan', 'Queso', 'Mantequilla'];
  public data1 = [
    [350, 250, 50]
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
