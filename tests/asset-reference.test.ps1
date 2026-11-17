$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$data = Get-Content -LiteralPath (Join-Path $root 'data/unit-school-supplies.js') -Raw
$image = Join-Path $root 'assets/images/school/pasnanava-an.png'
if (-not (Test-Path -LiteralPath $image)) { throw 'Missing approved school illustration' }
if ($data -notmatch 'pasnanava-an\.png') { throw 'School illustration is not referenced' }
Write-Output 'PASS asset references'
