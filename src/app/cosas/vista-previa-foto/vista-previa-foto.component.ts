import { Component, OnInit, Input } from '@angular/core';
import { ImagenesService } from '../../servicios/imagenes/imagenes.service';
import { Imagen } from '../../clases/imagen';

@Component({
  selector: 'vista-previa-foto',
  templateUrl: './vista-previa-foto.component.html',
  styleUrls: ['./vista-previa-foto.component.scss'],
})
export class VistaPreviaFotoComponent implements OnInit {
	@Input() foto: Imagen;
	@Input() usuario: string;
  constructor(private imagenes: ImagenesService) { }

  ngOnInit() {}

  public leDiLike(foto) {
		if (foto.meGusta.findIndex(x => x === this.usuario) !== -1) {
			return true;
		}
		return false;
	}

	public meGusta(foto, tipo) {
		if (tipo) {
			foto.meGusta.push(this.usuario);
		} else{
			let indice = foto.meGusta.findIndex(x => x === this.usuario);
			if(indice !== -1){
				foto.meGusta.splice(indice,1);
			}
		}
		this.imagenes.actualizarLikes(foto);
	}

}
