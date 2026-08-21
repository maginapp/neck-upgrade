export const MESSAGE_TYPES = {
  // popup -> newtab
  TOGGLE_ACTIVE_SETTINGS: 'popup:toggle-active-settings',
  // popup -> newtab
  GET_SETTINGS_OPEN_STATUS: 'popup:get-settings-open-status',
  // newtab -> popup
  SETTINGS_OPEN_STATUS: 'newtab:settings-open-status',
  // popup <-> 当前网页内容脚本
  GET_PAGE_WOBBLE_STATUS: 'popup:get-page-wobble-status',
  SET_PAGE_WOBBLE_CONFIG: 'popup:set-page-wobble-config',
} as const;
