---
'@up201905892/tokens': minor
'@up201905892/icons': minor
'@up201905892/ui': minor
---

First release. Design tokens (light and dark themes), the icon set and the accessible React components: Accordion, Alert, Badge, Button, Card, Checkbox, DataTable, Dialog, DropdownMenu, Field, Grid, IconButton, Input, Pagination, Popover, RadioGroup, Select, Skeleton, Spinner, Stack, Switch, Table, Tabs, Textarea, Toast, Tooltip and VisuallyHidden.

Border widths (`--ds-border-width-1`, `--ds-border-width-2`) and the focus ring (`--ds-focus-ring-width`, `--ds-focus-ring-offset`) are design tokens, and Stylelint rejects literal lengths in `border` and `outline` declarations.

Semantic shadow tokens per theme (`--ds-shadow-raised`, `--ds-shadow-floating`, `--ds-shadow-modal`) and `--ds-color-border-raised` make elevation visible in the dark theme (new `shadow.strong.*` primitives); the light theme is unchanged. `Card` and its parts break long words instead of overflowing.

Breaking change for early adopters: the `sideOffset` prop of `Tooltip` (and `DropdownMenuContent`) is now a spacing scale step (`SpaceStep`, for example `"2"`) instead of a number of pixels. The overlay offsets and collision padding of `Tooltip`, `DropdownMenu` and `Select` are read from the `--ds-space-*` tokens.

`Button` and `IconButton` accept `focusableWhenDisabled`: together with `disabled` the control stays in the Tab order (`aria-disabled`, click and form submission blocked) so focus is not lost when activating it disables it. `Pagination` uses it for the previous and next buttons.

`GridItem` only accepts a whole-number `colSpan` of 1 or more (anything else is ignored, with a development-only warning) and clamps it to the number of columns of the enclosing `Grid` when `columns` is a number.

`Accordion` (trigger and panel) and `Dialog` (title, description and body) break long words instead of overflowing, keeping the chevron and the close button visible.
