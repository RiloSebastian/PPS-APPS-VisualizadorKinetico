import { Component, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../servicios/auth/auth.service';
import { Usuario } from '../clases/usuario';
import { ComplementosService } from 'src/app/servicios/complementos.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
	public usuario: any = null;
	public subU: any = null;

	constructor(private router: Router, private auth: AuthService, private comp: ComplementosService) {
		console.log('accede a usuario');
		this.subU = this.auth.usuario.subscribe(user => {
			if (user !== null) {
				this.usuario = user;
				console.log(this.usuario);
			}
		});
	}

	public verCosas(tipo: string) {
		this.router.navigate(["/Cosas", tipo]);
	}

	public cerrarSesion() {
		this.auth.logout().then(() => {
			this.comp.playAudio('error');
			this.router.navigate([''])
		});
	}

	public ngOnDestroy(): void {
		if (this.subU !== null) {
			this.subU.unsubscribe();
		}
	}

}
