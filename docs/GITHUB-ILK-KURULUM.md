# Git remote ve ilk push

1. GitHub → **New repository** → ad: `greenleaf` (boş, README eklemeyin).
2. Yerel klasörde:

```bash
git init -b main
git remote add origin https://github.com/HESABINIZ/greenleaf.git
git push -u origin main
```

Kimlik doğrulama: Personal Access Token (**Contents: Read and write**). Username alanına GitHub kullanıcı adınız; şifre alanına token.
