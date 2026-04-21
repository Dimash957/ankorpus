# Ән мәтіндерінің корпусы

Қазақ поп, дәстүрлі және эстрадалық ән мәтіндерін зерттеуге арналған толық стек платформа.

## Технологиялар

- Next.js 16 (App Router)
- Supabase (Auth + PostgreSQL + RLS)
- Tailwind CSS v3
- Recharts

## Бастау

1. Тәуелділіктерді орнатыңыз:

```bash
npm install
```

2. Орта айнымалыларын дайындаңыз:

```bash
cp .env.example .env.local
```

`.env.local` ішіне Supabase жобасының мәндерін енгізіңіз:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

3. Supabase SQL орындау:

- [supabase/schema.sql](supabase/schema.sql)
- [supabase/seed.sql](supabase/seed.sql)

Немесе терминал арқылы бір командамен орындауға болады:

```powershell
./scripts/run-supabase-sql.ps1 -ProjectRef <your-project-ref> -DbPassword "<your-db-password>"
```

Ескерту: егер пароль ішінде `$` болса, PowerShell-де бір тырнақша қолданыңыз:

```powershell
./scripts/run-supabase-sql.ps1 -ProjectRef '<your-project-ref>' -DbPassword '<your$db$password>'
```

Егер schema/seed алдын ала орындалған болса:

```powershell
./scripts/run-supabase-sql.ps1 -ProjectRef <your-project-ref> -DbPassword "<your-db-password>" -SkipSchema -SkipSeed
```

4. Даму режимін іске қосу:

```bash
npm run dev
```

Қосымша: http://localhost:3000

## Auth және backend

- Кіру/тіркелу беті: /auth
- Профиль беті: /account
- Proxy Supabase session жаңартады: [proxy.ts](proxy.ts)

## API маршруттар

- GET /api/health
- GET /api/auth/user
- GET /api/artists
- GET /api/thematic-archives
- GET /api/songs?q=...&artists=...&genres=...&yearMin=...&yearMax=...
- GET /api/analysis
- POST /api/admin/songs (auth required)

## Supabase неге ыңғайлы

- Auth, Postgres, RLS бір платформада
- App Router-пен server/client client-тер ыңғайлы бірігеді
- MVP-тен production-ға дейін масштабтауға ыңғайлы

## Тексеру

```bash
npm run lint
npm run build
```
