# Greenleaf POS — Windows kurulum

## Gereksinimler

- Windows 10/11 x64
- [Node.js 20 LTS](https://nodejs.org/) (PATH’te `node` / `npm`)
- (Fiş) Zywell POS-80 USB

## Geliştirici / ilk kurulum (repo klonlu)

PowerShell **Yönetici**:

```powershell
cd C:\path\to\greenleaf
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\windows\Install-GreenleafPOS.ps1
```

- Uygulama: `C:\Program Files\GreenleafPOS`
- Veri: `%ProgramData%\GreenleafPOS\data` (güncellemede **silinmez**)
- Kısayol: masaüstü **Greenleaf POS.url** → `http://127.0.0.1:5190/app`
- Oturum açılışında görev: **GreenleafPOS**

Manuel başlatma:

```powershell
.\scripts\windows\Start-GreenleafPOS.ps1
```

## Fiş yazıcısı (bir kez)

```powershell
.\public\install\windows\greenleaf-zywell-setup.ps1
```

## Uzaktan güncelleme (sizin taraf)

1. `scripts\windows\Build-GreenleafReleaseZip.ps1` → `release\greenleaf-pos-x.y.z-win64.zip`
2. Zip’i mağazaya indirtin veya USB ile verin.
3. Kurulum klasörünü güncelleyin (`Install-GreenleafPOS.ps1` robocopy ile — **ProgramData dokunulmaz**).
4. İleride: HTTPS `latest.json` + küçük updater EXE (plan).

## VPS ile karıştırmayın

Greenleaf **5190**, Greenleaf bulut POS **5180**. Aynı sunucuda ikisi birden test edilebilir; veri klasörleri ayrıdır.
