import { Redirect } from 'expo-router';

/** @deprecated Use /lessons */
export default function UpcomingLessonsRedirect() {
  return <Redirect href="/lessons" />;
}
