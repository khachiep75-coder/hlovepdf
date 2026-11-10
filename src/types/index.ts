export type ToolCategory = 'all' | 'organize' | 'optimize' | 'convert' | 'edit-security' | 'ai';

export type ToolId = 
  | 'merge'
  | 'split'
  | 'compress'
  | 'pdf-to-jpg'
  | 'jpg-to-pdf'
  | 'rotate'
  | 'watermark'
  | 'protect'
  | 'unlock'
  | 'organize'
  | 'page-numbers'
  | 'sign'
  | 'crop'
  | 'ai-assistant';

export interface PDFTool {
  id: ToolId;
  title: string;
  titleVi: string;
  shortDesc: string;
  shortDescVi: string;
  category: ToolCategory;
  badge?: string;
  color: string;
  bgLight: string;
  textColor: string;
  accentBorder: string;
  acceptedFiles: string;
  multiple: boolean;
  popular?: boolean;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  pageCount?: number;
  rotation?: number;
  previewUrl?: string;
}

export interface ProcessingResult {
  blob: Blob;
  downloadName: string;
  originalSize: number;
  newSize: number;
  pageCount: number;
  extraInfo?: string;
}

export type Language = 'en' | 'vi';
