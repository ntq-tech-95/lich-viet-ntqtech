# Script hỗ trợ build file .apk Android trên ổ D (tránh làm đầy ổ C)
# Yêu cầu: Đã cài JDK 21 tại D:\DevTools\jdk-21 và Android SDK tại D:\Android\Sdk (hoặc đã cài Android Studio)
$ErrorActionPreference = "Stop"

if (Test-Path "D:\DevTools\jdk-21") {
  $env:JAVA_HOME = "D:\DevTools\jdk-21"
  $env:Path = "$env:JAVA_HOME\bin;$env:Path"
}
if (Test-Path "D:\Android\Sdk") {
  $env:ANDROID_HOME = "D:\Android\Sdk"
  $env:ANDROID_SDK_ROOT = "D:\Android\Sdk"
}
$env:GRADLE_USER_HOME = "D:\gradle-cache"
$env:npm_config_cache = "D:\npm-cache"

Set-Location $PSScriptRoot\..
npm run cap:sync

Set-Location android
.\gradlew.bat assembleDebug

$apkSrc = "app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkSrc) {
  New-Item -ItemType Directory -Path "..\release" -Force | Out-Null
  Copy-Item $apkSrc "..\release\Lich-Viet-1.0.0-debug.apk" -Force
  Write-Host "Da xuat APK thanh cong: D:\NTQTECH\am-lich-viet-nam\release\Lich-Viet-1.0.0-debug.apk"
}
