$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw
if ($html -notmatch 'styles\.css') { throw 'index.html must reference styles.css' }
if ($html -notmatch 'app\.js') { throw 'index.html must reference app.js' }
foreach ($id in @('app','adventure-map','mode-panel','mode-content','status')) {
  if ($html -notmatch ('id="' + $id + '"')) { throw "Missing #$id" }
}
Write-Output 'PASS structure'
