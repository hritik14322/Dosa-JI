---
name: Zod coerce boolean gotcha
description: z.coerce.boolean() is broken for query string params — "false" becomes true because Boolean("false") === true in JS
---

## Rule
Never use `z.coerce.boolean()` for HTTP query string parameters. Parse manually instead:

```ts
const isVeg = req.query.isVeg === "true" ? true : req.query.isVeg === "false" ? false : undefined;
```

**Why:** `Boolean("false") === true` in JavaScript — any non-empty string is truthy. So `z.coerce.boolean()` coerces the string `"false"` to the boolean `true`. Orval generates `zod.coerce.boolean()` for boolean query params via its `coerce: { query: ["boolean"] }` config — the generated validators are safe for numeric/string coercion, but NOT for boolean.

**How to apply:** Any route handler that receives boolean query params must bypass the Orval-generated `QueryParams` schema for those fields and parse them manually. Already applied to `isVeg` and `featured` in `artifacts/api-server/src/routes/menu.ts`.
