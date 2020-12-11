import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ImagenesService } from '../../servicios/imagenes/imagenes.service';
import { AuthService } from '../../servicios/auth/auth.service';
import { Imagen } from '../../clases/imagen';
import { ComplementosService } from 'src/app/servicios/complementos.service';
import { firebaseErrors } from 'src/assets/scripts/errores';

@Component({
	selector: 'app-lista-cosas',
	templateUrl: './lista-cosas.component.html',
	styleUrls: ['./lista-cosas.component.scss'],
})
export class ListaCosasComponent implements OnInit, OnDestroy {
	public usuario: any = null;
	public tipo;
	public galeria = 'fotosGlobales';
	public fotosAux: Array<any>;
	public fotos: Array<any>;
	public eliminar: boolean = false;
	public carga: string = null;
	public flagImgPicker: boolean = false;
	sub;


	constructor(private route: ActivatedRoute, public actionControl: ActionSheetController, private camera: Camera, private zone: NgZone,
		private auth: AuthService, private imagenes: ImagenesService, private imgPicker: ImagePicker, private comp: ComplementosService) {
		this.tipo = this.route.snapshot.paramMap.get('tipo');
	}

	ngOnInit() {
		this.sub = this.auth.usuario.subscribe(user => {
			if (user !== null) {
				this.usuario = user.email;
				this.traerFotos();
			}
		});
	}

	pickImage(sourceType) {
		const options: CameraOptions = {
			quality: 100,
			sourceType: sourceType,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			correctOrientation: true,
		}
		this.camera.getPicture(options).then(imageData => {
			this.carga = 'spinner';
			let base64Str = 'data:image/jpeg;base64,' + imageData;
			return this.imagenes.subirFoto(base64Str, this.usuario, this.tipo).then(doc => {
				const x = doc.data();
				x['id'] = doc.id;
				this.fotosAux.splice(0, 0, { ...x as Imagen });
				this.fotos = [...this.fotosAux];
				this.cambiarVisibilidad('misFotos');
			});
		}).catch(err => this.comp.presentToastConMensajeYColor(firebaseErrors(err), 'danger')).finally(() => this.carga = null);
	}

	pickImages() {
		const options: ImagePickerOptions = {
			outputType: 1,
		}
		let arrAux: Array<any> = [];
		this.imgPicker.getPictures(options).then(imagenes => {
			this.flagImgPicker = true;
			this.carga = 'spinner';
			for (let i = 0; i < imagenes.length; i++) {
				let base64Str = 'data:image/jpeg;base64,' + imagenes[i];
				this.imagenes.subirFoto(base64Str, this.usuario, this.tipo).then(x => {
					const y = x.data();
					y['id'] = x.id;
					this.fotosAux.splice(0, 0, { ...y as Imagen });
					if (i == (imagenes.length - 1)) {
						this.flagImgPicker = false;
					}
				});
			}
		}).catch(err => {
			this.flagImgPicker = false;
			this.comp.presentToastConMensajeYColor(firebaseErrors(err), 'danger')
		}).finally(() => {
			let y = setInterval(() => {
				if (!this.flagImgPicker) {
					this.fotos = [...this.fotosAux];
					this.cambiarVisibilidad('misFotos');
					this.carga = null;
					clearInterval(y);
				}
			}, 500);
		});
	}

	public traerFotos() {
		this.carga = 'spinner';
		setTimeout(() => { this.carga = null }, 2000)
		this.imagenes.traerFotos(this.tipo).then(snap => this.zone.run(()=> {
			this.fotosAux = snap.docs.map(doc => {
				const x = doc.data();
				x['id'] = doc.id;
				return { ...x as Imagen };
			});
			this.fotos = [...this.fotosAux];
		}));
	}

	cambiarVisibilidad(tipo) {
		this.galeria = tipo;
		if (this.galeria !== 'misFotos') {
			this.fotos = [...this.fotosAux];
			console.log(this.fotos);
			console.log(this.usuario);
		} else if (this.galeria === 'misFotos') {
			console.log(this.fotos);
			console.log(this.usuario);
			this.fotos = this.fotosAux.filter(foto => foto.usuario === this.usuario);
		}
	}

	async nuevaFoto() {
		const actionSheet = await this.actionControl.create({
			header: 'Agregar Fotos',
			buttons: [{
				text: 'Sacar foto con camara',
				icon: 'camera',
				handler: () => {
					this.pickImage(this.camera.PictureSourceType.CAMERA);
				}
			}, {
				text: 'Agregar desde la galería',
				icon: 'add',
				handler: () => {
					this.pickImages();
				}
			}, {
				text: 'Cancelar',
				icon: 'close',
				role: 'cancel'
			}]
		});
		await actionSheet.present();
	}

	public ngOnDestroy(): void {
		if (this.sub !== null) {
			this.sub.unsubscribe();
		}
	}
}
