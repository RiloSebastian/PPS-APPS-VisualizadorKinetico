import { Component, OnInit, Input, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { IonSlides } from '@ionic/angular'
import { DeviceMotion, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';
import { ImagenesService } from '../../servicios/imagenes/imagenes.service';
@Component({
	selector: 'app-tabla-cosas',
	templateUrl: './tabla-cosas.component.html',
	styleUrls: ['./tabla-cosas.component.scss'],
})
export class TablaCosasComponent implements OnInit, OnDestroy {
	@ViewChild('slider') slider: IonSlides;
	@Input() set fotos(value: Array<any>) {
		this._fotos = [];
		this._fotos = value;
		if (this.slider !== undefined) {
			this.slider.slideTo(0);
		}
	};
	public _fotos: Array<any> = [];
	@Input() usuario: string;
	public sub;
	constructor(private accel: DeviceMotion, private zone: NgZone) { }

	ngOnInit() {
		let ops: DeviceMotionAccelerometerOptions = { frequency: 200 }
		this.sub = this.accel.watchAcceleration(ops).subscribe(data => {
			if (data.x < -6) {
				this.slider.slideNext();
			} else if (data.x > 6) {
				this.slider.slidePrev();
			} if (data.y < 0) {
				this.slider.slideTo(0);
			}
		});
	}

	ngOnDestroy() {
		if (this.sub !== null) {
			this.sub.unsubscribe();
		}
	}
}
