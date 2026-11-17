$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$css = Get-Content -LiteralPath (Join-Path $root 'styles.css') -Raw
foreach ($rule in @('grid-template-columns:repeat(4','aspect-ratio:1.45','memory-card.revealed','memory-card.matched')) { if ($css -notmatch [regex]::Escape($rule)) { throw "Missing memory layout rule: $rule" } }
Write-Output 'PASS memory layout'
