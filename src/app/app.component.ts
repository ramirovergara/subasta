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
  flags = {
    isId: false,
    isDate: false,
    isType: false,
    isDeposit: false,
    isRequest: false,
    isValue: false,
    isPercentaje: false
  };
  progressLoading = 0;
  totalSubasta = 0;
  provinceCurrent = '';
  loadingNumber = 0;
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
      if (response) {
        this.subastasTotal = response.subastas.map(subas => {
            // tslint:disable-next-line:radix
            // subas['porcentaje'] =  Math.round( ( parseInt(subas.Cantidadreclamada) * 100 ) / parseInt(subas.Tasacion));
            let recla = this.amountToNumber(subas.Cantidadreclamada);
            let tasa = this.amountToNumber(subas.Valorsubasta);
            if (tasa !== null && recla !== null) {
                subas['porcentaje'] = Math.round( (recla * 100) / tasa * 100 ) / 100;
            } else {
              subas['porcentaje'] = 2000;
            }
            return subas;
          });
          this.subastas = this.subastasTotal.filter(subas => subas.porcentaje <= 30);
          this.orderByDatetime();
          //this.subastas = this.subastasTotal;
          console.log('response: ', this.subastas);
      }
    });

        setInterval(() =>  {
            if (this.provinceCurrent !== 'Ceuta' ) {
                this.subastasService.getProgress().subscribe(resp => {
                    console.log(resp);
                    this.progressLoading = resp.progress;
                    this.totalSubasta = resp.total;
                    this.provinceCurrent = resp.province;
                    this.loadingNumber = Math.round(  ((this.progressLoading * 100 ) / this.totalSubasta) * 100 ) / 100;
                });
                this.subastasService.getSubastas().subscribe(response => {
                    this.subastasTotal = response;
                    if (response) {
                        this.subastasTotal = response.subastas.map(subas => {
                            // tslint:disable-next-line:radix
                            // subas['porcentaje'] =  Math.round( ( parseInt(subas.Cantidadreclamada) * 100 ) / parseInt(subas.Tasacion));
                            let recla = this.amountToNumber(subas.Cantidadreclamada);
                            let tasa = this.amountToNumber(subas.Valorsubasta);
                            if (tasa !== null && recla !== null) {
                                subas['porcentaje'] = Math.round( (recla * 100) / tasa * 100 ) / 100;
                            } else {
                            subas['porcentaje'] = 2000;
                            }
                            return subas;
                        });
                        this.subastas = this.subastasTotal.filter(subas => subas.porcentaje <= 30);
                        this.flags.isDate = false;
                        this.orderByDatetime();
                        //this.subastas = this.subastasTotal;
                        console.log('response: ', this.subastas);
                    }
                });
            } else {
                this.progressLoading = this.totalSubasta;
                this.loadingNumber = 100;
            }
        }, 2000);
    }


  amountToNumber(value) {
    return value ? value.split('.').join('').replace('€', '').replace(',', '.') : null;
  }
  orderByDatetime() {
    this.subastas.sort(function(a, b) {
      const first = new Date(b.Fechadeconclusion.split('ISO:')[1].replace(')', '').trim() ).getTime();
      const second = new Date(a.Fechadeconclusion.split('ISO:')[1].replace(')', '').trim() ).getTime();
      return first - second;
    });
    if (this.flags.isDate) {
      this.subastas.reverse();
    }
    this.flags.isDate = !this.flags.isDate;
  }

  orderByText(text, flag) {
    this.subastas.sort(function(a, b) {
      let nameA = a[text].toUpperCase(); // ignore upper and lowercase
      let nameB = b[text].toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    if (this.flags[flag] ) {
      this.subastas.reverse();
    }
    this.flags[flag] = !this.flags[flag];
  }

  orderByNumber(value, flag) {
    this.subastas.sort(function (a, b) {
      return parseFloat((a[value] + '').split('.').join('')) - parseFloat((b[value] + '').split('.').join(''));
    });
    if (this.flags[flag] ) {
      this.subastas.reverse();
    }
    this.flags[flag] = !this.flags[flag];
  }

  filterPercentaje(value) {
    this.subastas = this.subastasTotal.filter(subas => subas.porcentaje <= parseInt(value));
  }


}