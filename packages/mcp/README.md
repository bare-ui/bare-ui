# @wire-ui/mcp

MCP (Model Context Protocol) server for [Wire UI](https://wire-ui.com) — AI-native unstyled primitives framework.

Gives AI coding tools direct access to Wire UI's component APIs, props, data attributes, and usage examples.

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

### `list_components`

List all Wire UI components with categories and descriptions.

| Parameter   | Type                                           | Default   | Description        |
| ----------- | ---------------------------------------------- | --------- | ------------------ |
| `framework` | `"react" \| "vue" \| "solid"`                  | `"react"` | Target framework   |
| `category`  | `"form" \| "overlay" \| "display" \| "layout"` | —         | Filter by category |

### `get_component`

Get full details for a specific component — props, data attributes, parts, and usage examples.

| Parameter   | Type                          | Default   | Description                              |
| ----------- | ----------------------------- | --------- | ---------------------------------------- |
| `name`      | `string`                      | required  | Component name (e.g., "Button", "Modal") |
| `framework` | `"react" \| "vue" \| "solid"` | `"react"` | Target framework                         |

### `get_decision_tree`

Get a decision tree to help choose the right component for a scenario.

| Parameter  | Type                               | Description         |
| ---------- | ---------------------------------- | ------------------- |
| `scenario` | `"form" \| "overlay" \| "styling"` | Which decision tree |

### `search_docs`

Search across all component documentation by keyword.

| Parameter   | Type                          | Default   | Description            |
| ----------- | ----------------------------- | --------- | ---------------------- |
| `query`     | `string`                      | required  | Free-text search query |
| `framework` | `"react" \| "vue" \| "solid"` | `"react"` | Target framework       |

### `get_installation_guide`

Get installation instructions, peer dependencies, styling approach, and data attribute reference.

No parameters required.

### `get_exports_list`

List all exports from the Wire UI package — components, hooks, and TypeScript types.

| Parameter   | Type                          | Default   | Description      |
| ----------- | ----------------------------- | --------- | ---------------- |
| `framework` | `"react" \| "vue" \| "solid"` | `"react"` | Target framework |

## Framework Support

Currently supports **React**. Vue and Solid support will be added when those packages are released — no server changes needed, just data additions.

## License

MIT
