import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  nombreUsuario: Observable<string | undefined>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.nombreUsuario = this.store
      .select('user')
      .pipe(
        filter(({ user }) => user !== null),
        map(({ user }) => user?.nombre)
      );
  }

  ngOnInit(): void {}

  logout() {
    this.authService.logout().then((_) => this.router.navigate(['/login']));
  }
}
