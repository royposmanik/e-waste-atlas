# E-Waste Atlas

An interactive, source-first explorer of the world's electronic waste — product categories, materials, fates, regions and the 2030 outlook — by the [W2R lab](https://w2r-lab.vercel.app/) at the Technion.

`e-waste-atlas.html` is a single self-contained page (data, photos and export logos are embedded). Every infographic can be downloaded as PDF or JPEG.

## Data
- **Global E-waste Monitor 2024** (Baldé et al., UNITAR / ITU) — headline figures, categories, materials, fates, continents, 2030 projection.
- **UN SDG Global Database** — series `EN_EWT_GENV`, `EN_EWT_GENPCAP`, `EN_EWT_RCYV`, `EN_EWT_RCYR` (custodian UNITAR), by UN M49 sub-region, 2010–2025. Raw downloads in `data/raw/`.
- **Photos** — Wikimedia Commons, credited with each image (`data/category-images.json`, `data/element-images.json`).

## Build
```bash
node data/build-data.js data/raw   # refresh data/data.js from the raw UN downloads
node data/assemble.js              # template + data + photos + logos -> e-waste-atlas.html
```
Edit `data/e-waste-atlas.template.html`, not the generated page.
