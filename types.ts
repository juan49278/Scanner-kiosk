
export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image_url?: string;
  stock?: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR'
}
