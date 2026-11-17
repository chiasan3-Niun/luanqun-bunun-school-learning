$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -LiteralPath (Join-Path $root 'index.html') -Raw
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
foreach ($name in @('speech-experiment','start-speech-check','open-asr','transcript-input','compare-transcript','download-recording','SpeechRecognition','compareTranscript')) {
  if (($html + $app) -match [regex]::Escape($name)) { throw "Removed feature still exists: $name" }
}
Write-Output 'PASS speech scoring removed'
