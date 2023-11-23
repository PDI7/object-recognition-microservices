import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressComponent} from "../../shared/components/progress/progress.component";
import {DragAndDropDirective} from "../../shared/directives/drag-and-drop.directive";
import {ObjectDetectionService} from "../../shared/services/object-detection.service";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {IObjectDetection} from "../../shared/interfaces/i-object-detection";
import {LibraryService} from "../../shared/services/library.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  objectDetections: IObjectDetection[] = [];
  files: any[] = [];

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


}
