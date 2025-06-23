export interface Product {
  id?: string;
  name: string;
  description: string;
  price: string;
}
export interface Document {
  id?: string;
  name: string;
  description: string;
  category: string;
  fileType: string;
  fileUrl: string;
}
export interface Notice {
  id?: string;
  title: string;
  content: string;
  createdAt: string;
}
export interface Factory {
  id?: string;
  name: string;
  type: string;
  contact: string;
}
export interface Media {
  id?: string;
  title: string;
  type: string;
  category: string;
}
export interface Carousel {
  id?: string;
  title: string;
  subtitle: string;
  order: number;
}
export interface Team {
  id?: string;
  name: string;
  position: string;
  type: string;
}
export interface Mail {
  id?: string;
  name: string;
  email: string;
  message: string;
}
