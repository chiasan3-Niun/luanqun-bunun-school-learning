$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$data = Get-Content -LiteralPath (Join-Path $root 'data/unit-school-supplies.js') -Raw
foreach ($word in @('pasnanava-an','patasan / haqil','ispapatas','isqaqaisqais','pangka','lungquan / palusu','hulus','patungqauta-an / patunpaklisan')) {
  if ($data -notmatch [regex]::Escape($word)) { throw "Missing vocabulary: $word" }
}
if ($data -notmatch 'sourceSentence') { throw 'Missing sourceSentence field' }
if (($data -split "audio:'assets/audio/school/").Count -lt 9) { throw 'Expected eight generated audio paths' }
Write-Output 'PASS content data'
