param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectRef,

  [Parameter(Mandatory = $true)]
  [string]$DbPassword,

  [switch]$SkipSchema,
  [switch]$SkipSeed
)

$ErrorActionPreference = "Stop"

function Invoke-NpxChecked {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Step,

    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  & npx.cmd @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Step failed: $Step (exit code $LASTEXITCODE). Command: npx $($Arguments -join ' ')"
  }
}

function Test-SupabaseLogin {
  & npx.cmd supabase projects list | Out-Null
  return ($LASTEXITCODE -eq 0)
}

Write-Host "[1/5] Checking Supabase CLI login..." -ForegroundColor Cyan
if (-not (Test-SupabaseLogin)) {
  Write-Host "No CLI auth found. Running supabase login..." -ForegroundColor Yellow
  Invoke-NpxChecked -Step "supabase login" -Arguments @("supabase", "login")

  if (-not (Test-SupabaseLogin)) {
    throw "Supabase CLI is still not authenticated. Run 'npx supabase login' manually and retry."
  }
}

Write-Host "[2/5] Linking project..." -ForegroundColor Cyan
Invoke-NpxChecked -Step "supabase link" -Arguments @("supabase", "link", "--project-ref", $ProjectRef, "--password", $DbPassword)

if (-not $SkipSchema) {
  Write-Host "[3/5] Running schema.sql..." -ForegroundColor Cyan
  Invoke-NpxChecked -Step "run schema.sql" -Arguments @("supabase", "db", "query", "--linked", "--file", "supabase/schema.sql")
} else {
  Write-Host "[3/5] Skipped schema.sql (--SkipSchema)." -ForegroundColor Yellow
}

if (-not $SkipSeed) {
  Write-Host "[4/5] Running seed.sql..." -ForegroundColor Cyan
  Invoke-NpxChecked -Step "run seed.sql" -Arguments @("supabase", "db", "query", "--linked", "--file", "supabase/seed.sql")
} else {
  Write-Host "[4/5] Skipped seed.sql (--SkipSeed)." -ForegroundColor Yellow
}

Write-Host "[5/5] Verifying row counts..." -ForegroundColor Cyan
Invoke-NpxChecked -Step "verify artists_count" -Arguments @("supabase", "db", "query", "--linked", "select count(*) as artists_count from public.artists;")
Invoke-NpxChecked -Step "verify thematic_archives_count" -Arguments @("supabase", "db", "query", "--linked", "select count(*) as thematic_archives_count from public.thematic_archives;")
Invoke-NpxChecked -Step "verify songs_count" -Arguments @("supabase", "db", "query", "--linked", "select count(*) as songs_count from public.songs;")

Write-Host "Done. Schema and seed executed successfully." -ForegroundColor Green
