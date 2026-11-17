$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$data = Get-Content -LiteralPath (Join-Path $root 'data/unit-school-supplies.js') -Raw
$assetPaths = [regex]::Matches($data, "(?:image|audio|sentenceAudio|audioVariants):'([^']+)'|(?:image|audio|sentenceAudio|audioVariants):\[([^\]]+)\]")
foreach ($match in $assetPaths) {
  $pathText = ($match.Groups[1].Value + ' ' + $match.Groups[2].Value)
  foreach ($path in [regex]::Matches($pathText, 'assets/[^''\s,]+')) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $path.Value))) { throw "Missing vocabulary asset: $($path.Value)" }
  }
}
if (($data -split 'sourceSentence:').Count -lt 9) { throw 'Every vocabulary item needs a source sentence' }
Write-Output 'PASS vocabulary bundle'
