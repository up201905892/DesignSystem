// Dark theme is opt-in: set data-theme="dark" on the <html> element.
export function setDarkTheme(enabled: boolean) {
  if (enabled) {
    document.documentElement.dataset.theme = 'dark';
  } else {
    // Without the attribute the light theme applies.
    delete document.documentElement.dataset.theme;
  }
}
