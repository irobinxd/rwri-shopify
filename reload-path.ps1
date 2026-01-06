# Reload PATH from User Environment Variables
# Run this in your current PowerShell session to reload PATH without restarting

$userPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
$machinePath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::Machine)
$env:PATH = "$machinePath;$userPath"

Write-Host "PATH reloaded!" -ForegroundColor Green
Write-Host ""
Write-Host "Testing PHP:" -ForegroundColor Cyan
php --version
Write-Host ""
Write-Host "Testing MySQL:" -ForegroundColor Cyan
mysql --version
Write-Host ""
Write-Host "Testing Composer:" -ForegroundColor Cyan
composer --version

