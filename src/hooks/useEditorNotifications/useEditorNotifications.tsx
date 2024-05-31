import {
  EditorNotificationsContext,
  EditorNotificationsContextType,
} from '@/context/editorNotificationsContext/EditorNotificationsContext';
import { useContext } from 'react';

export const useEditorNotifications = (): EditorNotificationsContextType => {
  const context = useContext(EditorNotificationsContext);

  if (!context) {
    throw new Error('useEditorNotifications must be used within an EditorNotificationsProvider');
  }

  return context;
};
