$ErrorActionPreference = "Stop"
$repo = "D:\curevanta-control-tower"
$env:TEMP = Join-Path $repo ".git-agent-tmp"
$env:TMP = $env:TEMP
Set-Location $repo

Write-Output "=== git status -sb ==="
git status -sb
Write-Output "=== git remote -v ==="
git remote -v
Write-Output "=== git log -3 --oneline ==="
git log -3 --oneline
Write-Output "=== git diff --stat ==="
git diff --stat
Write-Output "=== git diff --cached --stat ==="
git diff --cached --stat

git add -A
git reset -- .env* 2>$null
git reset -- node_modules 2>$null
git reset -- .next 2>$null
git reset -- out 2>$null
git reset -- build 2>$null

$staged = git diff --cached --name-only
if ($staged) {
  $msg = @"
Add Flutter Curevanta mobile app and pending Curevanta UI work.

Include mobile patient/doctor flows and remaining web UI updates for GitHub publish.
"@
  git -c user.email=techmunda21@gmail.com -c user.name="TechMunda" commit -m $msg
  Write-Output "=== NEW COMMIT ==="
  git log -1 --oneline
} else {
  Write-Output "=== NO STAGED CHANGES; SKIP COMMIT ==="
}

Write-Output "=== PUSH ==="
git push -u origin main 2>&1
Write-Output "=== gh auth status ==="
gh auth status 2>&1
Write-Output "=== FINAL STATUS ==="
git status -sb
