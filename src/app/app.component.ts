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
      console.log('response: ', response);
      this.subastas = response;
    });
  }

}
