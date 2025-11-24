---
description: GitHub development workflow
---

1. Check status: `git status`
2. Create branch: `git checkout -b <branch-name>` (naming: feature/*, fix/*, chore/*)
3. Commit changes: `git add .` and `git commit -m "<message>"`
4. Merge to main:
   - `git checkout main`
   - `git merge <branch-name>`
