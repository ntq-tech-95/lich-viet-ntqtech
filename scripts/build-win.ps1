# Đóng gói file cài đặt Windows (.exe) với toàn bộ cache lưu trên ổ D
$env:npm_config_cache = "D:\npm-cache"
$env:ELECTRON_CACHE = "D:\electron-cache"
$env:electron_config_cache = "D:\electron-cache"
$env:ELECTRON_BUILDER_CACHE = "D:\electron-builder-cache"
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"

Set-Location $PSScriptRoot\..
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if (Test-Path "node_modules\electron\dist\electron.exe") {
  npx electron-builder --win "-c.electronDist=node_modules/electron/dist"
} else {
  npx electron-builder --win
}
