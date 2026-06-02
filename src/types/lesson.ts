export interface Lesson {
  id: string;
  title: string;
  teacher: string;
  teacherAvatar: string;
  category: string;
  categoryEmoji: string;
  distance: string;
  duration: number;
  rating: number;
  reviews: number;
  time: string;
  location: string;
  featured?: boolean;
  slidePreviewColors: [string, string, string];
  price?: number;
}
