# Clear Cloudflare Deployments

A GitHub Action that prunes Cloudflare Pages deployments by deleting all preview deployments. This action keeps your Cloudflare pages tidy.

## Inputs

> [!NOTE]
> Story the authentication token in a GitHub Secret and reference it in the workflow with `${{ secrets.CF_AUTH_TOKEN }}`.

| Name             | Description                     |
|------------------|---------------------------------|
| `CF_ACCOUNT_ID`  | Cloudflare account ID           |
| `CF_PROJECT_NAME`| Cloudflare Pages project name   |
| `CF_AUTH_TOKEN`  | Cloudflare authentication token |

## Usage

Add the action to a workflow file.

## Development

### Build

```bash
pnpm run build
```

The build script compiles TypeScript and bundles the entry point using `ncc`.

### Lint

```bash
pnpm run lint
```

The project uses [Biome](https://biomejs.dev/) for linting and formatting.

## Contributing

Feel free to open issues or pull requests.
