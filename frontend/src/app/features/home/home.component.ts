import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressComponent} from "../../shared/components/progress/progress.component";
import {DragAndDropDirective} from "../../shared/directives/drag-and-drop.directive";
import {ObjectDetectionService} from "../../shared/services/object-detection.service";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {IObjectDetection} from "../../shared/interfaces/i-object-detection";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  objectDetections: IObjectDetection[] = [];
  // https://stackoverflow.com/questions/50482814/image-preview-before-upload-in-angular-5
  files: any[] = [];

  constructor(private objectDetectionService: ObjectDetectionService) {}

  /**
   * on file drop handler
   */
  onFileDropped(event: any) {
    this.prepareFilesList(event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(target: any) {
    this.prepareFilesList(target.files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      const reader = new FileReader();
      reader.onload = e => {
        this.objectDetections.push({
          name: item.name,
          size: item.size,
          originalImage: reader.result
        } as IObjectDetection)
      }
      reader.readAsDataURL(item);
    }
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
    item.isLoading = true;
    this.objectDetectionService
      .detectObjects(item.originalImage)
      .subscribe({
        next: response => {
        item.detectedImage = response.img;
        item.labels = response.labels;
        item.isLoading = false;
      }, error: error => {
        console.error(error);
        item.isLoading = false;
        item.error = error
      }
      });

  }
}
