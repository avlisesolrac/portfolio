# Defina os parâmetros de conexão com o banco Oracle
# Caminho para a DLL do Oracle.ManagedDataAccess
$OracleDLLPath = "C:\tclouddiscovery\Oracle.ManagedDataAccess.dll"

# Configurar o TNS_ADMIN (se não configurado no sistema)
#$env:TNS_ADMIN = "D:\outsourcing\totvs\oracle"

# Carregar a DLL no PowerShell
Add-Type -Path $OracleDLLPath

# String de conexão com o Oracle (usando o alias do tnsnames.ora)
$OracleConnectionString = "User Id=USUARIO_DO_BANCO;Password=SENHA_DO_BANCO;Data Source=ALIAS_DO_BANCO;"

# Conectar ao banco Oracle
$connection = New-Object Oracle.ManagedDataAccess.Client.OracleConnection($OracleConnectionString)

# Função para inserir dados aleatórios
Function Inserir-DadosAleatorios {
    # Criar conexão com o Oracle
    $connection = New-Object Oracle.ManagedDataAccess.Client.OracleConnection($OracleConnectionString)
    $connection.Open()

    Try {
        # Criar comando SQL
        $command = $connection.CreateCommand()
        $command.CommandText = @"
            INSERT INTO Z_DISASTER_RECOVERY (ID, NOME, IDADE, DATA_INSERCAO)
            VALUES (
                Z_DISASTER_RECOVERY_SEQ.NEXTVAL,
                'Nome' || TRUNC(DBMS_RANDOM.VALUE(1, 1000)),
                TRUNC(DBMS_RANDOM.VALUE(18, 60)),
                SYSTIMESTAMP
            )
"@
        # Executar o comando
        $command.ExecuteNonQuery()
        Write-Host "Dados inseridos com sucesso." -ForegroundColor Green
    }
    Catch {
        Write-Host "Erro ao inserir dados: $_" -ForegroundColor Red
    }
    Finally {
        # Fechar a conexão
        $connection.Close()
    }
}

# Loop infinito para inserir dados a cada 1 segundo
While ($true) {
    Inserir-DadosAleatorios
    Start-Sleep -Seconds 1
}
