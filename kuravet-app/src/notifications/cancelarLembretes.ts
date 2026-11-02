import * as Notifications from 'expo-notifications';

export async function cancelarLembretes(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
