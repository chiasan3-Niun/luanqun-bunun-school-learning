$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
foreach ($type in @('true-false','audio-picture','audio-word','image-word')) {
  if ($app -notmatch [regex]::Escape($type)) { throw "Missing listening question type: $type" }
}
foreach ($text in @('聽音選圖','聽音選字','圖文配對','是非判斷')) {
  if ($app -notmatch [regex]::Escape($text)) { throw "Missing listening label: $text" }
}
Write-Output 'PASS listening question types'
