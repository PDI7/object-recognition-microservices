import {Routes} from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import {LibraryComponent} from "./features/library/library.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'library',
    component: LibraryComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
