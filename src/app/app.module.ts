import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { IonicModule, IonicRouteStrategy, IonSlides } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { LoginComponent } from './login/login.component';
import { HomePage } from './home/home.page';
import { ListaCosasComponent } from './cosas/lista-cosas/lista-cosas.component';
import { TablaCosasComponent } from './cosas/tabla-cosas/tabla-cosas.component';
import { GraficoComponent } from './cosas/grafico/grafico.component';
import { VistaPreviaFotoComponent } from './cosas/vista-previa-foto/vista-previa-foto.component';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard'

@NgModule({
	declarations: [AppComponent, LoginComponent, HomePage, ListaCosasComponent, TablaCosasComponent, GraficoComponent, VistaPreviaFotoComponent],
	entryComponents: [],
	imports: [
	BrowserModule, 
	IonicModule.forRoot(), 
	AppRoutingModule, 
	FormsModule,
	ReactiveFormsModule,
	AngularFireModule.initializeApp(environment.firebaseConfig), 
	AngularFirestoreModule, 
	AngularFireAuthModule,
	AngularFireStorageModule,
	AngularFireAuthGuardModule,
	ChartsModule,
	],
	providers: [
		StatusBar,
		SplashScreen,
		IonSlides,
		Camera,
		ImagePicker,
		Vibration,
		DeviceMotion,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		ThemeService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
