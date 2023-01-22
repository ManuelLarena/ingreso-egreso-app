import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';

import Swal from 'sweetalert2';

import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoEgresoForm: FormGroup = this.fb.group({
    descripcion: ['', Validators.required],
    monto: ['', Validators.required],
  });

  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private ingresoEgresoServicie: IngresoEgresoService,
    private store: Store<AppState>,
  ) {
    this.loadingSubscription = this.store.select('ui').subscribe(({isLoading}) => this.cargando = isLoading);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  guardar() {
    this.store.dispatch(ui.isLoading());

    if (this.ingresoEgresoForm.invalid) {
      return;
    }
    // console.log(this.ingresoEgresoForm.value);
    // console.log(this.tipo);

    const { descripcion, monto } = this.ingresoEgresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoServicie
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoEgresoForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Registro creado', descripcion, 'success');
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error', err.message, 'error')
      });
  }
}
