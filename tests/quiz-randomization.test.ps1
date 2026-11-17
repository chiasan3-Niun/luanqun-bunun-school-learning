$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
foreach ($name in @('shuffle','questionOrder','listenOrder','option.index','data-answer')) {
  if ($app -notmatch [regex]::Escape($name)) { throw "Missing quiz randomization rule: $name" }
}
if ($app -match "renderMode\('listen-picture'\)" -and $app -match "setTimeout\(\(\) => renderMode\('listen-picture'\)") { throw 'Listen quiz must not reset to the first question after every answer' }
Write-Output 'PASS quiz randomization'
