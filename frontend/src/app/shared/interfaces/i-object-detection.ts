import {Label} from "./label";

export interface IObjectDetection {
  name: string;
  size: number;
  originalImage: string;
  detectedImage: string;
  labels: Label[];
  isLoading: boolean;
  error: any;
}
