# Diretório onde os arquivos serão criados
$directory = "D:\outsourcing\totvs\protheus_data\system\comparar_arquivos_disaster_recovery"
# Criar a pasta se ela não existir
if (-not (Test-Path $directory)) {
    New-Item -ItemType Directory -Path $directory
}

# Loop infinito para gerar arquivos até o PowerShell ser fechado
while ($true) {
    # Gerar um nome aleatório para o arquivo
    $fileName = [guid]::NewGuid().ToString() + ".txt"
    $filePath = Join-Path -Path $directory -ChildPath $fileName

    # Gerar conteúdo aleatório para o arquivo
    $content = -join ((65..90) + (97..122) | Get-Random -Count 100 | ForEach-Object {[char]$_})

    # Criar o arquivo com o conteúdo aleatório
    $content | Out-File -FilePath $filePath

    # Exibir mensagem no console
    Write-Host "Arquivo criado: $filePath" -ForegroundColor Green

    # Aguardar um tempo antes de criar o próximo arquivo (opcional)
    Start-Sleep -Seconds 1
}
