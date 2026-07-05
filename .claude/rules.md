# Project Rules

## Code Style
- Always place import statements at the top of the file, grouped with existing imports. Never add an import inline in the middle of the file.

## HTML Structure
- Heading tags (h1-h6) must follow strict document order, no skipped levels. Never pick a heading tag for something just because its default font-size looks right — decorative or rotated captions ("Follow", small vertical labels) should be span/p, not headings.
- List children must be <li> (or <script>/<template>). Never put <button>, <div>, or other elements directly inside <ul>/<ol> — wrap them in <li> first, even if it's a nav rendered as inline buttons.

## Commands
- Never run install, build, deploy, or dependency-update commands (npm install, pip install, yarn build, docker build, etc.). If one needs to run, tell the user the command to run themselves — do not execute it.
