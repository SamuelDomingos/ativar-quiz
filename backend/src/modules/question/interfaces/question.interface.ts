import { Option } from './option.interface';

export interface Question {
  id: string;
  text: string;
  imageUrl?: string | null;
  type: 'SINGLE' | 'MULTIPLE';
  options: Option[];
}
