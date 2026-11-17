$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$data = Get-Content -LiteralPath (Join-Path $root 'data/unit-school-supplies.js') -Raw
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
if ($data -notmatch 'sentenceAudio') { throw 'Missing sentenceAudio data field' }
foreach ($name in @('playCardAudio','playAudioSequence','repeatCount','playbackRate')) { if ($app -notmatch [regex]::Escape($name)) { throw "Missing audio behavior: $name" } }
if ($app -notmatch 'playbackRate = 0.8') { throw 'Audio speed must be 0.8' }
Write-Output 'PASS audio sequence'
