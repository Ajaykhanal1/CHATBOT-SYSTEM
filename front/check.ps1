Set-Location "C:\Users\khana\Desktop\CHATBOT SYSTEM\front"
& "C:\Program Files\nodejs\npx.cmd" tsc --noEmit 2>&1 | Out-File -FilePath tsc_result.txt -Encoding utf8
Write-Host "done"
Get-Content tsc_result.txt | Select-Object -Last 80
