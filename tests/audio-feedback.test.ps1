$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$app = Get-Content -LiteralPath (Join-Path $root 'app.js') -Raw
foreach ($name in @('reportAudioIssue','regenerateAudio','audio-report','regenerate-audio','localStorage')) { if (($app) -notmatch [regex]::Escape($name)) { throw "Missing audio feedback feature: $name" } }
if ($app -match 'window\.open\(') { throw 'Audio regeneration must stay in the page' }
if ($app -notmatch 'luanqunAudioRegenerationQueue') { throw 'Missing in-page regeneration queue' }
Write-Output 'PASS audio feedback'
