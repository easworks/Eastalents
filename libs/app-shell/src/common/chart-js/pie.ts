import { ArcElement, Chart, PieController } from 'chart.js';

Chart.registry.addControllers(PieController);
Chart.registry.addElements(ArcElement);