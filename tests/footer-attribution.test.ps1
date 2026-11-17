$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw
foreach ($text in @('site-footer','footer-copyright','ai-labs.ilrdf.org.tw')) {
  if ($html -notmatch [regex]::Escape($text)) { throw "Missing footer attribution: $text" }
}
Write-Output 'PASS footer attribution'
