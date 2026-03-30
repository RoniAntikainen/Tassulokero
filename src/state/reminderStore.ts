import { create } from "zustand";

import { currentUser } from "../data/mockData";
import { listRemindersForUser, saveReminder as saveReminderToDb } from "../lib/db";
import { useSharingStore } from "./sharingStore";
import { Reminder, ReminderGroup } from "../types/domain";

interface CreateReminderValues {
  petId: string;
  title: string;
  description?: string;
  dueAt: string;
  type: Reminder["type"];
}

interface ReminderState {
  reminders: Reminder[];
  hydrateReminders: (dbUserId: string) => Promise<void>;
  addReminder: (values: CreateReminderValues) => void;
  updateReminder: (id: string, values: Partial<Omit<Reminder, "id" | "petId" | "assigneeLabel">>) => void;
  completeReminder: (id: string) => void;
  cancelReminder: (id: string) => void;
}

export const useReminderStore = create<ReminderState>((set) => ({
  reminders: [],
  hydrateReminders: async (dbUserId) => {
    const rows = await listRemindersForUser(dbUserId);
    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string; displayName?: string } | null;

    set({
      reminders: rows.map((row: any) => ({
        id: row.id,
        petId: row.pet_id,
        title: row.title,
        description: row.description ?? undefined,
        dueAt: row.due_at,
        status: row.status,
        type: (row.source_type as Reminder["type"] | null) ?? "manual",
        assigneeLabel:
          row.user_id === dbUserId ? sessionUser?.displayName ?? currentUser.displayName : String(row.user_id),
      })),
    });
  },
  addReminder: (values) => {
    const familyAccesses = useSharingStore
      .getState()
      .accesses.filter((access) => access.petId === values.petId && access.role === "family" && access.canViewReminders);
    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { displayName?: string; dbUserId?: string } | null;
    const reminderBaseId = crypto.randomUUID();
    const ownerReminder: Reminder = {
      id: reminderBaseId,
      petId: values.petId,
      title: values.title,
      description: values.description,
      dueAt: values.dueAt,
      type: values.type,
      status: "pending",
      assigneeLabel: sessionUser?.displayName ?? currentUser.displayName,
    };
    const familyReminders = familyAccesses.map((access, index) => ({
      id: `${reminderBaseId}-family-${index + 1}`,
      petId: values.petId,
      title: values.title,
      description: values.description,
      dueAt: values.dueAt,
      type: values.type,
      status: "pending" as const,
      assigneeLabel: access.personName,
    }));

    set((state) => ({
      reminders: [ownerReminder, ...familyReminders, ...state.reminders],
    }));

    if (sessionUser?.dbUserId) {
      void saveReminderToDb({
        id: ownerReminder.id,
        userId: sessionUser.dbUserId,
        petId: ownerReminder.petId,
        title: ownerReminder.title,
        description: ownerReminder.description,
        dueAt: ownerReminder.dueAt,
        status: ownerReminder.status,
        type: ownerReminder.type,
      });
    }
  },
  updateReminder: (id, values) => {
    let nextReminder: Reminder | undefined;

    set((state) => ({
      reminders: state.reminders.map((item) => {
        if (item.id !== id) {
          return item;
        }

        nextReminder = {
          ...item,
          ...values,
        };

        return nextReminder;
      }),
    }));

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string; displayName?: string } | null;
    if (sessionUser?.dbUserId && nextReminder && nextReminder.assigneeLabel === (sessionUser.displayName ?? currentUser.displayName)) {
      void saveReminderToDb({
        id: nextReminder.id,
        userId: sessionUser.dbUserId,
        petId: nextReminder.petId,
        title: nextReminder.title,
        description: nextReminder.description,
        dueAt: nextReminder.dueAt,
        status: nextReminder.status,
        type: nextReminder.type,
        completedAt: nextReminder.status === "completed" ? new Date().toISOString() : null,
      });
    }
  },
  completeReminder: (id) => {
    let nextReminder: Reminder | undefined;

    set((state) => ({
      reminders: state.reminders.map((item) => {
        if (item.id !== id) {
          return item;
        }

        nextReminder = {
          ...item,
          status: "completed",
        };

        return nextReminder;
      }),
    }));

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string; displayName?: string } | null;
    if (sessionUser?.dbUserId && nextReminder && nextReminder.assigneeLabel === (sessionUser.displayName ?? currentUser.displayName)) {
      void saveReminderToDb({
        id: nextReminder.id,
        userId: sessionUser.dbUserId,
        petId: nextReminder.petId,
        title: nextReminder.title,
        description: nextReminder.description,
        dueAt: nextReminder.dueAt,
        status: "completed",
        type: nextReminder.type,
        completedAt: new Date().toISOString(),
      });
    }
  },
  cancelReminder: (id) => {
    let nextReminder: Reminder | undefined;

    set((state) => ({
      reminders: state.reminders.map((item) => {
        if (item.id !== id) {
          return item;
        }

        nextReminder = {
          ...item,
          status: "cancelled",
        };

        return nextReminder;
      }),
    }));

    const sessionUser = require("./authStore").useAuthStore.getState().sessionUser as { dbUserId?: string; displayName?: string } | null;
    if (sessionUser?.dbUserId && nextReminder && nextReminder.assigneeLabel === (sessionUser.displayName ?? currentUser.displayName)) {
      void saveReminderToDb({
        id: nextReminder.id,
        userId: sessionUser.dbUserId,
        petId: nextReminder.petId,
        title: nextReminder.title,
        description: nextReminder.description,
        dueAt: nextReminder.dueAt,
        status: "cancelled",
        type: nextReminder.type,
        completedAt: null,
      });
    }
  },
}));

export function getReminderGroup(reminder: Reminder): ReminderGroup {
  if (reminder.status === "completed") {
    return "completed";
  }

  const now = new Date();
  const dueDate = new Date(reminder.dueAt);

  if (dueDate < now) {
    return "overdue";
  }

  const isSameDay =
    dueDate.getFullYear() === now.getFullYear() &&
    dueDate.getMonth() === now.getMonth() &&
    dueDate.getDate() === now.getDate();

  if (isSameDay) {
    return "today";
  }

  return "upcoming";
}
