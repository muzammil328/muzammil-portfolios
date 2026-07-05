# Modals

Overlay components for dialogs, drawers, sheets, and alerts.

## Usage

```tsx
import { Dialog, Drawer, Sheet, DeleteModal } from '@muzammil/ui';

export function Example() {
	return <Dialog open={open} onOpenChange={setOpen} />;
}
```

## Notes

- Use `Dialog` for standard modals.
- Use `Drawer`/`Sheet` for side or bottom panels.
- Use `DeleteModal` and alert components for confirmations.
