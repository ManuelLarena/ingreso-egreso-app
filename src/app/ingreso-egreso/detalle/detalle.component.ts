import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppStateWithIngresos } from '../ingreso-egreso.reducer';

import Swal from 'sweetalert2';

import { IngresoEgreso } from '../../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit {
  ingresosEgresosSubs?: Observable<IngresoEgreso[]>;

  constructor(
    private store: Store<AppStateWithIngresos>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingresosEgresosSubs = this.store
      .select('ingresosEgresos')
      .pipe(map(({ items }) => items));
  }

  borrar(uid: string) {
    this.ingresoEgresoService
      .borrarIngresoEgreso(uid)
      .then(() => Swal.fire('Borrado', 'Item borrado', 'success'))
      .catch((err) => Swal.fire('Error', err.message, 'error'));
  }
}
