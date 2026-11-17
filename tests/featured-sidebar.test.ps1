$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
$css = Get-Content -LiteralPath (Join-Path $root 'styles.css') -Raw
foreach ($name in @('featured-card','thumbnail-rail','thumbnail-list')) { if (($html + $app) -notmatch [regex]::Escape($name)) { throw "Missing layout element: $name" } }
foreach ($color in @('--lake','--coral','--lavender')) { if ($css -notmatch [regex]::Escape($color)) { throw "Missing palette token: $color" } }
if ($app -notmatch 'thumbnail-card\$\{item\.id === selected\.id') { throw 'Thumbnail rail must mark the selected image' }
if ($css -notmatch 'thumbnail-card\.active') { throw 'Thumbnail rail needs an active image state' }
Write-Output 'PASS featured sidebar layout'
