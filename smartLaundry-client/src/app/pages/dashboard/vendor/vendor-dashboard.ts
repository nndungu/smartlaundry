import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.html',
  styleUrls: ['./vendor-dashboard.scss']
})
export class VendorDashboardComponent implements OnInit {
  constructor() {
    // Initialization logic here
  }

  ngOnInit(): void {
    this.drawEarningsChart();
  }

  private drawEarningsChart(): void {
    const svg = document.getElementById('earningsChart') as unknown as SVGElement;
    if (!svg) return;

    const width = 600;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    // Sample earnings data
    const data = [
      { month: 'Jan', earnings: 1200 },
      { month: 'Feb', earnings: 1500 },
      { month: 'Mar', earnings: 1800 },
      { month: 'Apr', earnings: 2200 },
      { month: 'May', earnings: 2800 },
      { month: 'Jun', earnings: 3200 }
    ];

    // Scales
    const xScale = (i: number) => (i / (data.length - 1)) * (width - margin.left - margin.right) + margin.left;
    const yScale = (value: number) => height - margin.bottom - (value / 3500) * (height - margin.top - margin.bottom);

    // Create path for the line
    let pathData = '';
    data.forEach((d, i) => {
      const x = xScale(i);
      const y = yScale(d.earnings);
      if (i === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });

    // Close the path for fill
    pathData += ` L ${xScale(data.length - 1)} ${height - margin.bottom} L ${xScale(0)} ${height - margin.bottom} Z`;

    // Update the line path
    const linePath = svg.querySelector('#linePath') as SVGPathElement;
    if (linePath) {
      linePath.setAttribute('d', pathData);
    }

    // Update the polyline
    const polyline = svg.querySelector('#linePolyline') as SVGPolylineElement;
    if (polyline) {
      const points = data.map((d, i) => `${xScale(i)},${yScale(d.earnings)}`).join(' ');
      polyline.setAttribute('points', points);
    }

    // Add points
    const pointsGroup = svg.querySelector('#pointsGroup') as SVGGElement;
    if (pointsGroup) {
      pointsGroup.innerHTML = '';
      data.forEach((d, i) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', xScale(i).toString());
        circle.setAttribute('cy', yScale(d.earnings).toString());
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#4285f4');
        pointsGroup.appendChild(circle);
      });
    }

    // Add axis labels
    const xAxisLabels = svg.querySelector('#xAxisLabels') as SVGGElement;
    if (xAxisLabels) {
      xAxisLabels.innerHTML = '';
      data.forEach((d, i) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', xScale(i).toString());
        text.setAttribute('y', (height - margin.bottom + 20).toString());
        text.setAttribute('text-anchor', 'middle');
        text.textContent = d.month;
        xAxisLabels.appendChild(text);
      });
    }

    const yAxisLabels = svg.querySelector('#yAxisLabels') as SVGGElement;
    if (yAxisLabels) {
      yAxisLabels.innerHTML = '';
      const yValues = [0, 1000, 2000, 3000];
      yValues.forEach(value => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (margin.left - 10).toString());
        text.setAttribute('y', yScale(value).toString());
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('dominant-baseline', 'middle');
        text.textContent = `$${value}`;
        yAxisLabels.appendChild(text);
      });
    }
  }
}
