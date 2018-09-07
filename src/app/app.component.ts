import { Component, OnInit } from '@angular/core';
import { ServicesService } from './shared/services.service';
import {ChildProcessService} from 'ngx-childprocess';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  subastas = [];
  subastasTotal = [];
  constructor(private subastasService: ServicesService,
    private childProcessService: ChildProcessService)  {}

  ngOnInit() {
    // this.childProcessService.childProcess.exec('ls', [], response => {
    //   console.log(response);
    // });
    // childProces.exec('ls', [], function (error, stdout, stderr) {
    //   console.log(error, stdout, stderr);
    // });
    this.subastasService.getSubastas().subscribe(response => {
      this.subastasTotal = response;
      this.subastasTotal = this.subastasTotal.map(subas => {
        // tslint:disable-next-line:radix
        // subas['porcentaje'] =  Math.round( ( parseInt(subas.Cantidadreclamada) * 100 ) / parseInt(subas.Tasacion));

        let recla = this.amountToNumber(subas.Cantidadreclamada);
        let tasa = this.amountToNumber(subas.Tasacion);
        if (tasa !== null && recla !== null) {
            subas['porcentaje'] = Math.round( (recla * 100) / tasa * 100 ) / 100;
        } else {
          subas['porcentaje'] = 2000;
        }

        return subas;
      });
      this.subastas = this.subastasTotal.filter(subas => subas.porcentaje <= 25);
      //this.subastas = this.subastasTotal;
      console.log('response: ', this.subastas);
    });
  }

  amountToNumber(value) {
    return value ? value.split('.').join('').replace('€', '').replace(',', '.') : null;
  }

}
