import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IObjectDetection} from "../../shared/interfaces/i-object-detection";
import {LibraryService} from "../../shared/services/library.service";
import {
  ObjectDetectionCardComponent
} from "../../shared/components/object-detection-card/object-detection-card.component";

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, ObjectDetectionCardComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit {
  objectDetections: IObjectDetection[] = [];
  loading = false;

  constructor(private libraryService: LibraryService) {
  }

  ngOnInit(): void {
    this.getAllItems()
  }

  getAllItems() {
    this.loading = true;
    this.libraryService.getAll().subscribe({
      next: items => {
        this.objectDetections = items.reverse();
        this.loading = false;
      }, error: error => {
        console.error(error);
        this.loading = false;
      }
    });
  }


}
