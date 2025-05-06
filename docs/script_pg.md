
```bat
@echo off
setlocal

:: Configuration variables
set PG_DIR=C:\pgsql
set PG_DATA=%PG_DIR%\data
set PG_PORT=5432
set PG_USER=postgres
set PG_PASSWORD=123456
set PG_LOG_FILE=%PG_DIR%\pg_server.log

:: Set environment variables
set PATH=%PG_DIR%\bin;%PATH%
set PGDATA=%PG_DATA%
set PGLOCALEDIR=%PG_DIR%\share\locale

:: Ensure PG_DIR exists
if not exist "%PG_DIR%" (
    echo Error: PostgreSQL directory %PG_DIR% does not exist.
    exit /b 1
)

:: Check if data directory exists; if not, initialize the database cluster
if not exist "%PG_DATA%\postgresql.conf" (
    echo Initializing database cluster in %PG_DATA%...
    echo %PG_PASSWORD%>%PG_DIR%\pgpass.txt
    "%PG_DIR%\bin\initdb.exe" -U %PG_USER% -A md5 --pwfile=%PG_DIR%\pgpass.txt -E UTF8
    if errorlevel 1 (
        echo Error: Failed to initialize database cluster.
        exit /b 1
    )
    :: Configure pg_hba.conf for password authentication
    echo host all all 127.0.0.1/32 md5>>"%PG_DATA%\pg_hba.conf"
    echo host all all ::1/128 md5>>"%PG_DATA%\pg_hba.conf"
    del "%PG_DIR%\pgpass.txt"
)

:: Check if PostgreSQL is already running
"%PG_DIR%\bin\pg_ctl.exe" status -D "%PG_DATA%" >nul 2>&1
if %errorlevel% equ 0 (
    echo PostgreSQL is already running on port %PG_PORT%.
) else (
    echo Starting PostgreSQL server...
    "%PG_DIR%\bin\pg_ctl.exe" start -D "%PG_DATA%" -l "%PG_LOG_FILE%"
    if errorlevel 1 (
        echo Error: Failed to start PostgreSQL server. Check %PG_LOG_FILE% for details.
        exit /b 1
    )
)

echo PostgreSQL is running on port %PG_PORT%.
echo Log file: %PG_LOG_FILE%
echo To connect, use: psql -U %PG_USER% -p %PG_PORT% -d postgres
echo To stop the server, run: %PG_DIR%\bin\pg_ctl.exe stop -D %PG_DATA%
echo Press any key to keep the server running...
pause >nul

endlocal
```