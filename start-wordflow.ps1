$ErrorActionPreference = 'SilentlyContinue'
$url = 'http://localhost:5173'
$running = Get-NetTCPConnection -LocalPort 5173 -State Listen
if (-not $running) {
  $log = Join-Path $env:TEMP 'wordflow-vite.log'
  Start-Process -FilePath 'npm.cmd' -ArgumentList 'run', 'dev' -WorkingDirectory 'D:\english-app' -WindowStyle Hidden -RedirectStandardOutput $log -RedirectStandardError "$log.err"
  for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 500
    if (Get-NetTCPConnection -LocalPort 5173 -State Listen) { break }
  }
}
Start-Process $url