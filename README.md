# Greenleaf POS

Yerel kurulumlu perakende satış noktası: satış, stok, kasa, raporlar. Veri kurulum yapılan bilgisayarda (`MARKET_POS_DATA_DIR`) tutulur.

## Gereksinimler

- Node.js 20 LTS
- Windows 10/11 (önerilen) veya geliştirme için macOS/Linux

## Geliştirme

```bash
npm install
cp .env.greenleaf.example .env
npm run greenleaf:dev
```

Uygulama: **http://127.0.0.1:5190/app**

## Windows kurulum

[docs/WINDOWS-KURULUM.md](docs/WINDOWS-KURULUM.md)

## Mimari

[docs/GREENLEAF-DESKTOP.md](docs/GREENLEAF-DESKTOP.md)

## Sürüm

`package.json` → `version` · derleme kimliği `dist/app-release.json`
