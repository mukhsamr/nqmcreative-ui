/**
 * `@nqmcreative/ui` has no root export, on purpose.
 *
 * Every component belongs to a style, and a style is a deliberate choice — so
 * it has to be named at the import:
 *
 *   import { Button } from '@nqmcreative/ui/matte';
 *   import { Button } from '@nqmcreative/ui/paper';
 *
 * A default here would let people pick one by accident and never find out.
 * Shared behaviour lives at `@nqmcreative/ui/core`.
 */
export {};
