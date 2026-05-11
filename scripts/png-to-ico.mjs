import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

const src = resolve(process.argv[2])
const dst = resolve(process.argv[3])
const png = readFileSync(src)

const w = 0
const h = 0
const bpp = 32
const dir = Buffer.alloc(16)
dir.writeUInt8(w, 0)
dir.writeUInt8(h, 1)
dir.writeUInt8(0, 2)
dir.writeUInt8(0, 3)
dir.writeUInt16LE(1, 4)
dir.writeUInt16LE(bpp, 6)
dir.writeUInt32LE(png.length, 8)
dir.writeUInt32LE(22, 12)

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)

const ico = Buffer.concat([header, dir, png])
writeFileSync(dst, ico)
console.log(`Wrote ${ico.length} bytes to ${dst}`)
