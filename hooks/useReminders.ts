import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remindersService } from '@/services/remindersService';
import { InsertReminder, UpdateReminder, Reminder } from '@/types/models';

export const REMINDERS_KEY = ['reminders'];

export function useReminders() {
  return useQuery({
    queryKey: REMINDERS_KEY,
    queryFn: remindersService.getAll,
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newReminder: InsertReminder) => remindersService.create(newReminder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
    },
  });
}

export function useCreateReminderWithLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reminderData, locationData }: { 
      reminderData: Omit<InsertReminder, 'location_id' | 'user_id'>, 
      locationData: { name: string, address?: string, lat: number, lng: number, radius: number } 
    }) => remindersService.createWithLocation(reminderData, locationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReminder }) =>
      remindersService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
    },
  });
}

export function useToggleReminderDone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_done }: { id: string; is_done: boolean }) =>
      remindersService.update(id, { is_done, status: is_done ? 'Done' : 'Active' }),
    onMutate: async ({ id, is_done }) => {
      await queryClient.cancelQueries({ queryKey: REMINDERS_KEY });
      const previousReminders = queryClient.getQueryData<Reminder[]>(REMINDERS_KEY);

      if (previousReminders) {
        queryClient.setQueryData<Reminder[]>(
          REMINDERS_KEY,
          previousReminders.map(r => 
            r.id === id 
              ? { ...r, is_done, status: is_done ? 'Done' : 'Active' } 
              : r
          )
        );
      }
      return { previousReminders };
    },
    onError: (err, newReminder, context) => {
      if (context?.previousReminders) {
        queryClient.setQueryData(REMINDERS_KEY, context.previousReminders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
    }
  });
}

export function useArchiveReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remindersService.archive(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: REMINDERS_KEY });
      const previousReminders = queryClient.getQueryData<Reminder[]>(REMINDERS_KEY);

      if (previousReminders) {
        queryClient.setQueryData<Reminder[]>(
          REMINDERS_KEY,
          previousReminders.map(r => r.id === id ? { ...r, deleted_at: new Date().toISOString() } : r)
        );
      }
      return { previousReminders };
    },
    onError: (err, newReminder, context) => {
      if (context?.previousReminders) {
        queryClient.setQueryData(REMINDERS_KEY, context.previousReminders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
    }
  });
}

export function useRestoreReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_done }: { id: string; is_done: boolean }) => remindersService.restore(id, is_done),
    onMutate: async ({ id, is_done }) => {
      await queryClient.cancelQueries({ queryKey: REMINDERS_KEY });
      const previousReminders = queryClient.getQueryData<Reminder[]>(REMINDERS_KEY);

      if (previousReminders) {
        queryClient.setQueryData<Reminder[]>(
          REMINDERS_KEY,
          previousReminders.map(r => r.id === id ? { ...r, is_done, status: is_done ? 'Done' : 'Active', deleted_at: null } : r)
        );
      }
      return { previousReminders };
    },
    onError: (err, newReminder, context) => {
      if (context?.previousReminders) {
        queryClient.setQueryData(REMINDERS_KEY, context.previousReminders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
    }
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => remindersService.delete(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: REMINDERS_KEY });
      const previousReminders = queryClient.getQueryData<Reminder[]>(REMINDERS_KEY);

      if (previousReminders) {
        queryClient.setQueryData<Reminder[]>(
          REMINDERS_KEY,
          previousReminders.filter(r => r.id !== id)
        );
      }
      return { previousReminders };
    },
    onError: (err, newReminder, context) => {
      if (context?.previousReminders) {
        queryClient.setQueryData(REMINDERS_KEY, context.previousReminders);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REMINDERS_KEY });
    }
  });
}
