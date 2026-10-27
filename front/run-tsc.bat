@echo off
cd /d %~dp0
call npx tsc --noEmit 2>&1 > tsc_result.txt
echo DONE
