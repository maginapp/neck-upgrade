import { MESSAGE_TYPES } from '@/constants/events';

type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

interface BaseMessage {
  type: MessageType;
}

export interface ToggleActiveSettingsMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.TOGGLE_ACTIVE_SETTINGS;
  isOpen?: boolean;
}

export interface GetSettingsOpenStatusMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.GET_SETTINGS_OPEN_STATUS;
}

export interface SettingsOpenStatusMessage extends BaseMessage {
  type: typeof MESSAGE_TYPES.SETTINGS_OPEN_STATUS;
  isOpen: boolean;
}

export type ChromeMessage =
  | ToggleActiveSettingsMessage
  | GetSettingsOpenStatusMessage
  | SettingsOpenStatusMessage;
