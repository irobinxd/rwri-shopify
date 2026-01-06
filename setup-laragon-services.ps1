# Laragon Service Setup Script
# Run this script as Administrator to install Laragon services

Write-Host "Laragon Service Setup" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

$laragonPath = "C:\laragon"

if (-not (Test-Path $laragonPath)) {
    Write-Host "ERROR: Laragon not found at $laragonPath" -ForegroundColor Red
    exit 1
}

# Find Apache installation
$apachePath = Get-ChildItem "$laragonPath\bin\apache" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
if ($apachePath) {
    $apacheBin = Join-Path $apachePath.FullName "bin\httpd.exe"
    if (Test-Path $apacheBin) {
        Write-Host "Found Apache at: $($apachePath.FullName)" -ForegroundColor Green
        
        # Check if service already exists
        $apacheService = Get-Service -Name "LaragonApache" -ErrorAction SilentlyContinue
        if ($apacheService) {
            Write-Host "LaragonApache service already exists." -ForegroundColor Yellow
        } else {
            Write-Host "Installing Apache as service..." -ForegroundColor Yellow
            & $apacheBin -k install -n "LaragonApache"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Apache service installed successfully!" -ForegroundColor Green
            } else {
                Write-Host "Failed to install Apache service." -ForegroundColor Red
            }
        }
        
        # Set to auto-start
        $apacheService = Get-Service -Name "LaragonApache" -ErrorAction SilentlyContinue
        if ($apacheService) {
            Set-Service -Name "LaragonApache" -StartupType Automatic -ErrorAction SilentlyContinue
            Write-Host "Apache service set to auto-start." -ForegroundColor Green
        }
    }
} else {
    Write-Host "Apache not found in Laragon." -ForegroundColor Yellow
}

# Find MySQL installation
$mysqlPath = Get-ChildItem "$laragonPath\bin\mysql" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
if ($mysqlPath) {
    $mysqlBin = Join-Path $mysqlPath.FullName "bin\mysqld.exe"
    if (Test-Path $mysqlBin) {
        Write-Host "Found MySQL at: $($mysqlPath.FullName)" -ForegroundColor Green
        
        # Check if service already exists
        $mysqlService = Get-Service -Name "LaragonMySQL" -ErrorAction SilentlyContinue
        if ($mysqlService) {
            Write-Host "LaragonMySQL service already exists." -ForegroundColor Yellow
        } else {
            Write-Host "Installing MySQL as service..." -ForegroundColor Yellow
            & $mysqlBin --install "LaragonMySQL"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "MySQL service installed successfully!" -ForegroundColor Green
            } else {
                Write-Host "Failed to install MySQL service." -ForegroundColor Red
            }
        }
        
        # Set to auto-start
        $mysqlService = Get-Service -Name "LaragonMySQL" -ErrorAction SilentlyContinue
        if ($mysqlService) {
            Set-Service -Name "LaragonMySQL" -StartupType Automatic -ErrorAction SilentlyContinue
            Write-Host "MySQL service set to auto-start." -ForegroundColor Green
        }
    }
} else {
    Write-Host "MySQL not found in Laragon." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Service Status:" -ForegroundColor Cyan
Write-Host "===============" -ForegroundColor Cyan

$services = Get-Service | Where-Object {$_.Name -like "*Laragon*"}
if ($services) {
    foreach ($service in $services) {
        $status = if ($service.Status -eq "Running") { "Running" } else { "Stopped" }
        $color = if ($service.Status -eq "Running") { "Green" } else { "Yellow" }
        Write-Host "$($service.Name): $status (Startup: $($service.StartType))" -ForegroundColor $color
    }
} else {
    Write-Host "No Laragon services found." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To start services manually:" -ForegroundColor Cyan
Write-Host "  Start-Service LaragonApache" -ForegroundColor White
Write-Host "  Start-Service LaragonMySQL" -ForegroundColor White
Write-Host ""
Write-Host "To stop services:" -ForegroundColor Cyan
Write-Host "  Stop-Service LaragonApache" -ForegroundColor White
Write-Host "  Stop-Service LaragonMySQL" -ForegroundColor White
Write-Host ""
Write-Host "Done!" -ForegroundColor Green

