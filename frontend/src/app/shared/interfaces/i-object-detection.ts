import {Label} from "./label";

export interface IObjectDetection {
  id: string;
  name: string;
  size: number;
  originalImage: string;
  detectedImage: string;
  labels: Label[];
  isDetecting: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  saved: boolean;
  error: any;
}
