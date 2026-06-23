// Bundles the SAME pre-created files RUNS times. The two assets
// (src/assets/alpha.png, src/assets/beta.png) are byte-identical, so rolldown
// dedups them to one output asset. Its filename is taken from whichever copy
// emits first — a race — so the asset name and the entry chunk hash that
// embeds it change from run to run despite identical input.
import {rolldown} from 'rolldown'

const RUNS = Number(process.argv[2] ?? 10)
const seen = new Set()
for (let r = 0; r < RUNS; r++) {
  const bundle = await rolldown({input: 'src/entry.js', moduleTypes: {'.png': 'asset'}})
  const {output} = await bundle.generate({
    assetFileNames: 'assets/[name]-[hash][extname]',
    entryFileNames: '[name]-[hash].js',
  })
  await bundle.close()
  const asset = output.find(o => o.type === 'asset').fileName
  const entry = output.find(o => o.type === 'chunk').fileName
  seen.add(asset + ' ' + entry)
  console.log(asset, entry)
}
console.log(`\n${seen.size} distinct outputs across ${RUNS} builds of identical input` +
  (seen.size > 1 ? ' — NON-DETERMINISTIC' : ' (try more runs)'))
