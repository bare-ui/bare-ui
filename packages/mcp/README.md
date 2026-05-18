# @wire-ui/mcp

MCP (Model Context Protocol) server for [Wire UI](https://wire-ui.com) — AI-native unstyled primitives framework.

Gives AI coding tools direct access to Wire UI's components, hooks/primitives/composables, props, data attributes, and usage examples across React, Solid, and Vue.

## Installation

```bash
npx @wire-ui/mcp
```

## IDE Configuration

Manual configuration for each IDE.

| IDE             | Config File (Linux)                    | Config File (macOS)                                                         |
| --------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| Claude Code     | `~/.claude.json` or `.mcp.json`        | `~/.claude.json` or `.mcp.json`                                            |
| Claude Desktop  | N/A                                    | `~/Library/Application Support/Claude/claude_desktop_config.json`           |
| VS Code         | `~/.config/Code/User/mcp.json`         | `~/Library/Application Support/Code/User/mcp.json`                         |
| Cursor          | `~/.config/Cursor/User/mcp.json`       | `~/Library/Application Support/Cursor/User/mcp.json`                       |
| Windsurf        | `~/.config/Windsurf/User/mcp.json`     | `~/Library/Application Support/Windsurf/User/mcp.json`                     |
| Trae            | `~/.config/Trae/User/mcp.json`         | `~/Library/Application Support/Trae/User/mcp.json`                         |

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wire-ui": {
      "command": "npx",
      "args": ["@wire-ui/mcp"]
    }
  }
}
```

### Cursor

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "wire-ui": {
      "command": "npx",
      "args": ["@wire-ui/mcp"]
    }
  }
}
```

### VS Code / Windsurf / Trae

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "wire-ui": {
      "command": "npx",
      "args": ["@wire-ui/mcp"]
    }
  }
}
```

## Available Tools

Every tool accepts a `framework` parameter — `"react"`, `"solid"`, or `"vue"` (default: `"react"`). The server returns import statements, code snippets, and naming that match the chosen framework (e.g. React/Vue surface hooks as `useX`, Solid as `createX`).

### `list_components`

List all Wire UI components for a framework with categories and descriptions.

| Parameter   | Type                                                                              | Default   | Description        |
| ----------- | --------------------------------------------------------------------------------- | --------- | ------------------ |
| `framework` | `"react" \| "vue" \| "solid"`                                                     | `"react"` | Target framework   |
| `category`  | `"form" \| "overlay" \| "display" \| "layout" \| "navigation" \| "feedback"`      | —         | Filter by category |

### `get_component`

Get full details for a specific component — props, data attributes, parts, and usage examples.

| Parameter   | Type                          | Default   | Description                              |
| ----------- | ----------------------------- | --------- | ---------------------------------------- |
| `name`      | `string`                      | required  | Component name (e.g., "Button", "Modal") |
| `framework` | `"react" \| "vue" \| "solid"` | `"react"` | Target framework                         |

### `list_hooks`

List all hooks (React/Vue) or primitives (Solid) — also called composables in Vue.

| Parameter   | Type                                                                                       | Default   | Description       |
| ----------- | ------------------------------------------------------------------------------------------ | --------- | ----------------- |
| `framework` | `"react" \| "vue" \| "solid"`                                                              | `"react"` | Target framework  |
| `category`  | `"state" \| "interaction" \| "observer" \| "positioning" \| "timing" \| "dom"`             | —         | Filter by category |

### `get_hook`

Get details for a specific hook/primitive/composable — signature, return value, and example. Accepts any naming form (`useDisclosure`, `createDisclosure`, or canonical `disclosure`).

| Parameter   | Type                          | Default   | Description       |
| ----------- | ----------------------------- | --------- | ----------------- |
| `name`      | `string`                      | required  | Hook name         |
| `framework` | `"react" \| "vue" \| "solid"` | `"react"` | Target framework  |

### `get_decision_tree`

Get a decision tree to help choose the right component for a scenario.

| Parameter  | Type                                                                                       | Description         |
| ---------- | ------------------------------------------------------------------------------------------ | ------------------- |
| `scenario` | `"form" \| "overlay" \| "navigation" \| "feedback" \| "hooks" \| "styling"`                | Which decision tree |

### `search_docs`

Search across components, hooks, and decision trees by keyword.

| Parameter   | Type                          | Default   | Description            |
| ----------- | ----------------------------- | --------- | ---------------------- |
| `query`     | `string`                      | required  | Free-text search query |
| `framework` | `"react" \| "vue" \| "solid"` | `"react"` | Target framework       |

### `get_installation_guide`

Get installation instructions, peer dependencies, styling approach, and data attribute reference for the chosen framework.

| Parameter   | Type                          | Default   | Description      |
| ----------- | ----------------------------- | --------- | ---------------- |
| `framework` | `"react" \| "vue" \| "solid"` | `"react"` | Target framework |

### `get_exports_list`

List all exports from a Wire UI package — components, hooks/primitives/composables, and TypeScript types.

| Parameter   | Type                          | Default   | Description      |
| ----------- | ----------------------------- | --------- | ---------------- |
| `framework` | `"react" \| "vue" \| "solid"` | `"react"` | Target framework |

## Framework Support

| Framework | Package           | Hooks surface as |
| --------- | ----------------- | ---------------- |
| React     | `@wire-ui/react`  | `useX`           |
| Solid     | `@wire-ui/solid`  | `createX`        |
| Vue       | `@wire-ui/vue`    | `useX` (composables) |

A small number of components are only available in `@wire-ui/react` (currently `Popover`, `Slider`, `Tabs`) and the MCP server reports this when you query them with another framework.

## License

MIT
