export const collections = {
  users: 'users',
  usernames: 'usernames',
  lessons: 'lessons',
  bookings: 'bookings',
  reviews: 'reviews',
} as const;

export const storagePaths = {
  userAvatar: (userId: string) => `users/${userId}/avatar.jpg`,
} as const;
