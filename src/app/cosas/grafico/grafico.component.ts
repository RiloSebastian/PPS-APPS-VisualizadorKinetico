import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { Imagen } from '../../clases/imagen';
import { ModalController } from '@ionic/angular';
import { VistaPreviaFotoComponent } from '../vista-previa-foto/vista-previa-foto.component';


@Component({
	selector: 'grafico',
	templateUrl: './grafico.component.html',
	styleUrls: ['./grafico.component.scss'],
})
export class GraficoComponent implements OnInit {
	@Input() fotos: Array<Imagen>;
	@Input() tipo: string;
	@Input() usuario: string;

	public fotoSeleccionada: Imagen;
	public verFoto: boolean = false;
	public chartData: number[];
	public chartLabels: Label[];
	public chartDataSets: ChartDataSets[];
	public chartLegend: boolean;
	public chartType: ChartType;
	public chartOptions: ChartOptions;

	constructor(public modalController: ModalController) { }

	ngOnInit() {
		let aux = this.fotos.filter(f => f.meGusta.length > 0);
		if (this.tipo === 'lindas') {
			this.chartLegend = true;
			this.chartLabels = aux.map(f => f.usuario + '_' + f.fechaDeSubida);
			this.chartData = aux.map(f => f.meGusta.length);
			this.chartType = 'pie';
			this.chartOptions = {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					position: 'top',
				},
			};
		} else if (this.tipo === 'feas') {
			this.chartLegend = true;
			this.chartLabels = aux.map(f => f.usuario + '_' + f.fechaDeSubida);
			this.chartDataSets = this.generarDatasets(aux);
			this.chartType = 'bar';
			this.chartOptions = {
				responsive: true,
				maintainAspectRatio: false,
				scales: { xAxes: [{ display: false, }], yAxes: [{ ticks: { stepSize: 1, min: 0 } }] },

			};
		}
	}

	public chartClicked(e: any): void {
		console.log(e);
		if (e.active.length > 0) {
			const chart = e.active[0]._model;
			let aux = chart.label.split('_');
			this.fotoSeleccionada = this.fotos.find(f => (f.usuario === aux[0] && f.fechaDeSubida === parseInt(aux[1])));
			console.log(this.fotoSeleccionada);
			if (this.fotoSeleccionada !== undefined) {
				console.log(this.usuario);
				this.verFoto = true;
			}
		}
	}

	generarDatasets(arr: Imagen[]) {
		let aux: any[] = [];
		arr.forEach((f, i) => {
			let label = f.usuario + '_' + f.fechaDeSubida;
			let data: any[] = [];
			for (let j = 0; j < arr.length; j++) {
				if (j === i) {
					data.push(f.meGusta.length);
				} else {
					data.push(null);
				}
			}
			aux.push({ data: data, label: label, categoryPercentage: 1.0, barPercentage: 1.0 });
		});
		console.log(aux);
		return aux;
	}
}
