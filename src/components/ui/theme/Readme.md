# Themes

Theme helpers exported from `@muzammil/ui`.

## Usage

```typescript
import { useTheme, ThemeToggle, THEME } from '@muzammil/ui';

export function Header() {
	const { theme, setTheme } = useTheme();

	return <ThemeToggle />;
}
```

## Notes

- Use `useTheme()` to read or update the active theme.
- Use `ThemeToggle` for a ready-made switch.
- `THEME` contains the available theme values.
