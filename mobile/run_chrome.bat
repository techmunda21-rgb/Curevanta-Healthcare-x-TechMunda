@echo off
REM Run Curevanta Flutter with temp on D: (C: is often full)
if not exist D:\temp\flutter mkdir D:\temp\flutter
set TMP=D:\temp\flutter
set TEMP=D:\temp\flutter
set PUB_CACHE=D:\pub-cache
if not exist D:\pub-cache mkdir D:\pub-cache
cd /d "%~dp0"
flutter pub get
flutter run -d chrome %*
