export const collections = {
  users: 'users',
  lessons: 'lessons',
  bookings: 'bookings',
  reviews: 'reviews',
} as const;

export const storagePaths = {
  lessonDeck: (lessonId: string) => `lessons/${lessonId}/deck.pptx`,
  userAvatar: (userId: string) => `users/${userId}/avatar.jpg`,
} as const;
