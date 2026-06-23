# rolldown asset-dedup non-determinism repro

Two byte-identical assets imported under different names dedupe to one output asset,
but the surviving asset's filename is taken from whichever copy emits **first** — a
race across parallel module processing. The name lands in `[name]` of `assetFileNames`,
so it changes the bytes (and `[hash]`) of every chunk that references the asset.
Byte-identical input produces different asset/chunk hashes per build.

```
npm install
node build.mjs       # bundles the same tree 10 times
```

The asset content hash is identical every build (same bytes), but `[name]` flips
between `alpha` and `beta`, and the entry chunk hash flips with it:

```
assets/beta-CNfGETmG.png  entry-ChyZcn2i.js
assets/alpha-CNfGETmG.png entry-CKEv6OVF.js
...
2 distinct outputs across 10 builds of identical input
```

The winner flips ~40% of builds, so a few runs reliably diverge.
