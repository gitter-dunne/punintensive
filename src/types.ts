export interface Slide {
  level: number;
  content: string;
  tutorial: boolean;
  audioUrl?: string;
  downloadUrl?: string;
  downloadText?: string;
  link?: string;
  linkText?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface PresentationData {
  id: string;
  title: string;
  recordingDate: string;
  recordingTime: string;
  permanentRedaction: boolean;
  sessionLink: string;
  theme?: 'flat-rainbow' | 'pastel-shine'
  slides: Slide[];
}