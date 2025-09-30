# Script de lancement propre de l'API

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  LANCEMENT PROPRE DE L'API" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Etape 1 : Arrêter tous les processus
Write-Host "[1/4] Arrêt des processus dotnet..." -ForegroundColor Yellow
Get-Process -Name "dotnet" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "      OK" -ForegroundColor Green

# Etape 2 : Supprimer la base de données
Write-Host "`n[2/4] Suppression de la base de données..." -ForegroundColor Yellow
$dropDb = @"
ALTER DATABASE XtraWork SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE XtraWork;
"@

try {
    sqlcmd -S LAPTOP-81IAD844 -E -Q $dropDb 2>&1 | Out-Null
    Write-Host "      OK - Base supprimée" -ForegroundColor Green
} catch {
    # La base n'existe peut-être pas, ce n'est pas grave
    Write-Host "      OK - Base n'existait pas" -ForegroundColor Gray
}

# Etape 3 : Nettoyer les fichiers temporaires
Write-Host "`n[3/4] Nettoyage..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
if (Test-Path "bin") { Remove-Item -Recurse -Force "bin" -ErrorAction SilentlyContinue }
if (Test-Path "obj") { Remove-Item -Recurse -Force "obj" -ErrorAction SilentlyContinue }
Write-Host "      OK" -ForegroundColor Green

# Etape 4 : Lancer l'API
Write-Host "`n[4/4] Lancement de l'API..." -ForegroundColor Yellow
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Entity Framework va créer la base" -ForegroundColor Green
Write-Host "  automatiquement au démarrage !" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Attendez de voir :" -ForegroundColor Yellow
Write-Host "  Now listening on: https://localhost:7033" -ForegroundColor Gray
Write-Host "  Now listening on: http://localhost:5280`n" -ForegroundColor Gray

Start-Sleep -Seconds 2

# Lancer
dotnet run
