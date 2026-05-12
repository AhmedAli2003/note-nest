// Used as electron-builder afterPack hook.
// Strips all locales except en-US.pak from the unpacked app directory.
const { readdirSync, unlinkSync, existsSync } = require("fs")
const { join } = require("path")

exports.default = async function (context) {
  const localesDir = join(context.appOutDir, "locales")

  if (!existsSync(localesDir)) {
    console.log("  • locales directory not found, skipping.")
    return
  }

  const keep = new Set(["en-US.pak"])
  let removed = 0

  for (const file of readdirSync(localesDir)) {
    if (!keep.has(file)) {
      unlinkSync(join(localesDir, file))
      removed++
    }
  }

  console.log(`  • stripped ${removed} locale files, kept en-US.pak only.`)
}
