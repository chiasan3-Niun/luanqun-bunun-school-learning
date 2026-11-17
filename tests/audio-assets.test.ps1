$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$audioRoot = Join-Path $root 'assets/audio/school'
foreach ($name in @('pasnanava-an','patasan','ispapatas','isqaqaisqais','pangka','lungquan','hulus','telephone')) {
  $path = Join-Path $audioRoot ($name + '.wav')
  if (-not (Test-Path -LiteralPath $path)) { throw "Missing audio asset: $name" }
}
foreach ($name in @('pasnanava-an-sentence','patasan-sentence','ispapatas-sentence','isqaqaisqais-sentence','pangka-sentence','lungquan-sentence','hulus-sentence','patungqauta-an-sentence','student-sentence')) {
  $path = Join-Path $audioRoot ($name + '.wav')
  if (-not (Test-Path -LiteralPath $path)) { throw "Missing sentence audio asset: $name" }
}
Write-Output 'PASS audio assets'
