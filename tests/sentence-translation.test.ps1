$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$data = Get-Content -LiteralPath (Join-Path $root 'data/unit-school-supplies.js') -Raw
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
if ($data -notmatch 'sourceTranslation') { throw 'Missing sourceTranslation field' }
if (($data -split 'sourceTranslation').Count -lt 4) { throw 'Expected three source translations' }
if ($app -notmatch 'sourceTranslation') { throw 'App does not render sourceTranslation' }
Write-Output 'PASS sentence translations'
