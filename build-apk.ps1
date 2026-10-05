param(
  [string]$ApiBase = 'http://172.16.37.182:3001'
)

$ErrorActionPreference = 'Stop'
$env:JAVA_HOME = 'C:\Users\vokha\.jdks\jbr-21.0.11'
$env:ANDROID_HOME = 'D:\Android\Sdk'
$env:ANDROID_SDK_ROOT = 'D:\Android\Sdk'
$env:VITE_API_BASE = $ApiBase
$adb = 'D:\Android\Sdk\platform-tools\adb.exe'

Write-Host "Building with API base: $ApiBase" -ForegroundColor Cyan

Push-Location 'D:\english-app'
npx vite build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }
npx cap sync android
if ($LASTEXITCODE -ne 0) { Pop-Location; exit 1 }

Push-Location 'D:\english-app\android'
.\gradlew.bat assembleDebug --no-daemon -q
$buildOk = ($LASTEXITCODE -eq 0)
Pop-Location
Pop-Location
if (-not $buildOk) { exit 1 }

$apk = 'D:\english-app\android\app\build\outputs\apk\debug\app-debug.apk'
& $adb install -r $apk
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host "`nDone. Installed $apk" -ForegroundColor Green
