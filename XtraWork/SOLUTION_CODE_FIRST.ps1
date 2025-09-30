# Solution Code First - Laisser Entity Framework créer la base

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SOLUTION CODE FIRST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Etape 1 : Arrêter l'API
Write-Host "[1/3] Arrêt de l'API..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "      OK" -ForegroundColor Green

# Etape 2 : Supprimer la base de données
Write-Host "`n[2/3] Suppression de la base de données..." -ForegroundColor Yellow
sqlcmd -S LAPTOP-81IAD844 -E -Q "DROP DATABASE IF EXISTS XtraWork;" 2>&1 | Out-Null
Write-Host "      OK - Base de données supprimée" -ForegroundColor Green

# Etape 3 : Relancer l'API (Entity Framework créera automatiquement la base)
Write-Host "`n[3/3] Démarrage de l'API..." -ForegroundColor Yellow
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Entity Framework va créer" -ForegroundColor Green
Write-Host "  la base automatiquement !" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Set-Location $PSScriptRoot
dotnet run
