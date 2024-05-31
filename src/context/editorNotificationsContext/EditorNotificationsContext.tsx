import React, { createContext, useState, ReactNode, useMemo, useCallback } from 'react';

type ErrorNotification =
  | {
      type: 'general';
    }
  | {
      type: 'missing_nodes';
      missingNodes: string[];
      allNodesCount: number;
    };

export type EditorNotificationType = ErrorNotification;

export type EditorNotificationsContextType = {
  lastNotification?: EditorNotificationType;
  addNotification(notification: EditorNotificationType): void;
  removeLastNotification(): void;
};

export const EditorNotificationsContext = createContext<EditorNotificationsContextType | undefined>(undefined);

export const EditorNotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<EditorNotificationType[]>([]);

  const lastNotification = useMemo(() => notifications[notifications.length - 1], [notifications]);

  const addNotification = useCallback((notification: EditorNotificationType) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.type !== notification.type).concat(notification),
    );
  }, []);

  const removeLastNotification = useCallback(() => {
    setNotifications((prevNotifications) => prevNotifications.slice(0, -1));
  }, []);

  const value = useMemo(
    () => ({
      lastNotification,
      addNotification,
      removeLastNotification,
    }),
    [lastNotification, addNotification, removeLastNotification],
  );

  return <EditorNotificationsContext.Provider value={value}>{children}</EditorNotificationsContext.Provider>;
};
