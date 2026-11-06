# Changesets

Every change that alters the behaviour of a published package (`@up201905892/tokens`, `@up201905892/icons`, `@up201905892/ui`) needs a changeset. Run `pnpm changeset`, pick the packages, choose the bump type and describe the change for the changelog.

- **patch**: bug fixes and internal changes with no API change.
- **minor**: new components, props or tokens that stay backwards compatible.
- **major**: breaking changes (removed or renamed props, changed prop types, removed tokens).

The three packages are `fixed`: they always share the same version. `apps/*` are ignored. Changes that only touch docs, tests or workflow files do not need a changeset.

Publishing is a manual step done by the maintainer; there is no publish script. `pnpm version-packages` applies the pending changesets to versions and changelogs.
