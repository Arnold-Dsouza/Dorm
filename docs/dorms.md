# Dorm structure

- Shared code stays under `src/components`, `src/hooks`, `src/lib`, `src/app`.
- Each dorm lives in `src/dorms/<dorm-id>/` with its own data/config.
- Registry at `src/dorms/registry.ts` exposes `getDormConfig()` and `dormRegistry`; default is `tabu`.

## Current dorm
- `src/dorms/tabu/` holds all TABU-specific data and labels.
- `src/lib/data.ts` now re-exports TABU data for backward compatibility; new code should import from the dorm registry instead of the legacy path.

## Adding another dorm
1) Copy `src/dorms/tabu` to `src/dorms/<new-id>` and adjust ids, labels, feature flags, and data.
2) Register it in `src/dorms/registry.ts` and set `defaultDormId` if needed.
3) Keep shared components data-agnostic; pass `getDormConfig('<id>')` into screens to source buildings, menus, and labels.
4) If a dorm needs a custom view, place it under `src/dorms/<id>/overrides/` and conditionally load it where needed.

## Routing note
- Today the app loads the default dorm. To support user selection or `/dorms/:id` routing, read from `dormRegistry` and validate `:id`, falling back to `defaultDormId`.
