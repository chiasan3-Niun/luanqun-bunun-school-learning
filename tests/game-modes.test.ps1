$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$data = Get-Content -LiteralPath (Join-Path $root 'data/unit-school-supplies.js') -Raw
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
foreach ($mode in @('listen-picture','memory-match','sentence-challenge','boss-challenge')) { if ($data -notmatch [regex]::Escape($mode)) { throw "Missing game mode: $mode" } }
foreach ($name in @('renderMode','awardStar','renderBoss')) { if ($app -notmatch [regex]::Escape($name)) { throw "Missing game behavior: $name" } }
Write-Output 'PASS game modes'
