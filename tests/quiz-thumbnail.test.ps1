$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$css = Get-Content -LiteralPath (Join-Path $root 'styles.css') -Raw
if ($css -notmatch '\.choice-art img') { throw 'Missing quiz thumbnail image rule' }
if ($css -notmatch 'height:180px') { throw 'Quiz thumbnails need a fixed compact height' }
Write-Output 'PASS quiz thumbnails'
