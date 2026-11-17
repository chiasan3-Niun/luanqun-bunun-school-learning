$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
if ($html -match 'type="module"') { throw 'file:// mode cannot use module script' }
if ($app -match '^import\s') { throw 'file:// mode cannot use app.js imports' }
if ($html -notmatch 'unit-school-supplies\.js') { throw 'index.html must load the data script before app.js' }
Write-Output 'PASS file mode load'
