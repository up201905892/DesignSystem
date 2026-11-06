---
'@up201905892/tokens': minor
'@up201905892/icons': minor
'@up201905892/ui': minor
---

First release. Design tokens (light and dark themes), the icon set and the accessible React components: Accordion, Alert, Badge, Button, Card, Checkbox, DataTable, Dialog, DropdownMenu, Field, Grid, IconButton, Input, Pagination, Popover, RadioGroup, Select, Skeleton, Spinner, Stack, Switch, Table, Tabs, Textarea, Toast, Tooltip and VisuallyHidden.

Breaking change for early adopters: the `sideOffset` prop of `Tooltip` (and `DropdownMenuContent`) is now a spacing scale step (`SpaceStep`, for example `"2"`) instead of a number of pixels. The overlay offsets and collision padding of `Tooltip`, `DropdownMenu` and `Select` are read from the `--ds-space-*` tokens.
