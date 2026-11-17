$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
$css = Get-Content -LiteralPath (Join-Path $root 'styles.css') -Raw
foreach ($name in @('adventure-map','mode-panel','game-stats','stars','boss-challenge')) { if (($html + $app) -notmatch [regex]::Escape($name)) { throw "Missing game layout: $name" } }
foreach ($color in @('--lake','--coral','--lavender')) { if ($css -notmatch [regex]::Escape($color)) { throw "Missing new palette token: $color" } }
foreach ($name in @('recording-panel','start-recording','stop-recording','play-recording','recording-status')) { if ($html -match [regex]::Escape($name)) { throw "Recording feature still exists: $name" } }
Write-Output 'PASS game layout'
