import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimerComponent} from "../timer/timer.component";
import {IObjectDetection} from "../../interfaces/i-object-detection";
import {ObjectDetectionService} from "../../services/object-detection.service";
import {LibraryService} from "../../services/library.service";

@Component({
  selector: 'app-object-detection-card',
  standalone: true,
  imports: [CommonModule, TimerComponent],
  templateUrl: './object-detection-card.component.html',
  styleUrl: './object-detection-card.component.css'
})
export class ObjectDetectionCardComponent {

  @Input()
  item?: IObjectDetection;

  @Input()
  showActions = true;


  constructor(private objectDetectionService: ObjectDetectionService,
              private libraryService: LibraryService) {
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals = 0) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  detectObjects(item: IObjectDetection) {
    item.isDetecting = true;
    this.objectDetectionService
      .detectObjects(item.originalImage)
      .subscribe({
        next: response => {
          item.detectedImage = response.img;
          item.labels = response.labels;
          item.isDetecting = false;
          item.error = null;
        }, error: error => {
          console.error(error);
          item.isDetecting = false;
          item.error = error
        }
      });

  }

  saveToLibrary(item: IObjectDetection) {
    item.isSaving = true
    this.libraryService.saveItem(item).subscribe({
      next: result => {
        item.id = result.id;
        item.isSaving = false;
        item.saved = true;
        item.error = null;
      }, error: error => {
        console.error(error);
        item.isSaving = false;
        item.error = error;
      }
    });
  }

  removeFromLibrary(item: IObjectDetection) {
    item.isDeleting = true;
    this.libraryService.deleteById(item.id).subscribe({
      next: () => {
        item.isDeleting = false;
        item.error = null;
        if (!this.showActions) {
          window.location.reload();
        }
        item.saved = false;
      }, error: error => {
        console.error(error);
        item.isDeleting = false;
        item.error = error;
      }
    });

  }
}
