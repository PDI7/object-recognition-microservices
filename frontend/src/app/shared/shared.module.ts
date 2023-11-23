import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {ObjectDetectionService} from "./services/object-detection.service";
import {ProgressComponent} from "./components/progress/progress.component";
import {DragAndDropDirective} from "./directives/drag-and-drop.directive";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {SanitizerUrlPipe} from "./pipes/sanitizer-url.pipe";
import {TimerComponent} from "./components/timer/timer.component";


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
    TimerComponent
  ],
  exports: [
    ProgressComponent,
    FormsModule,
    SanitizerUrlPipe,
    NgOptimizedImage,
    TimerComponent
  ],
  providers: [
    ObjectDetectionService,
  ]
})
export class SharedModule {
}
