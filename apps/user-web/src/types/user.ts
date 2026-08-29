export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  position?: string;
  photoURL: string;
  role: string
  createdAt: Date;
  updatedAt: Date;
}