import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ObjectDetectionService} from "./services/object-detection.service";
import {ProgressComponent} from "./components/progress/progress.component";
import {DragAndDropDirective} from "./directives/drag-and-drop.directive";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SanitizerUrlPipe} from "./pipes/sanitizer-url.pipe";
import {TimerComponent} from "./components/timer/timer.component";
import {LibraryService} from "./services/library.service";
import {ObjectDetectionCardComponent} from "./components/object-detection-card/object-detection-card.component";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProgressComponent,
    DragAndDropDirective,
    HttpClientModule,
    FormsModule,
    SanitizerUrlPipe,
    NgOptimizedImage,
    TimerComponent,
    ObjectDetectionCardComponent,
    RouterModule
  ],
  exports: [
    ProgressComponent,
    FormsModule,
    RouterModule,
    SanitizerUrlPipe,
    NgOptimizedImage,
    TimerComponent,
    ObjectDetectionCardComponent
  ],
  providers: [
    ObjectDetectionService,
    LibraryService
  ]
})
export class SharedModule {
}
