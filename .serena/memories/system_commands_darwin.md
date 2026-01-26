# System Commands (Darwin/macOS)

This project is developed on macOS (Darwin). Here are important system-specific commands and considerations.

## File System Operations

### Listing Files

```bash
ls                    # List files in current directory
ls -la                # List all files with details (including hidden)
ls -lh                # List with human-readable sizes
ls -lt                # List sorted by modification time
```

### Finding Files

```bash
find . -name "*.tsx"              # Find TypeScript React files
find . -type f -name "fragment*"  # Find files starting with "fragment"
find . -type d -name "components" # Find directories named "components"
```

### Searching Content

```bash
grep -r "pattern" app/            # Recursive search in app directory
grep -i "pattern" file.txt        # Case-insensitive search
grep -n "pattern" file.txt        # Show line numbers
grep -l "pattern" *.ts            # Show only filenames
```

### File Operations

```bash
cat file.txt              # Display file contents
head -n 20 file.txt       # Show first 20 lines
tail -n 20 file.txt       # Show last 20 lines
tail -f log.txt           # Follow log file (live updates)
wc -l file.txt            # Count lines in file
```

### Directory Operations

```bash
pwd                       # Print working directory
cd path/to/dir            # Change directory
cd ..                     # Go up one level
cd ~                      # Go to home directory
mkdir dirname             # Create directory
mkdir -p path/to/dir      # Create nested directories
```

## Git Operations

### Status and Info

```bash
git status                # Check working tree status
git log --oneline -10     # View last 10 commits
git log --graph           # View commit graph
git diff                  # Show unstaged changes
git diff --staged         # Show staged changes
git branch                # List local branches
git remote -v             # Show remote URLs
```

### Working with Changes

```bash
git add file.txt          # Stage specific file
git add .                 # Stage all changes
git commit -m "message"   # Commit staged changes
git commit --amend        # Amend last commit
git reset HEAD file.txt   # Unstage file
git checkout -- file.txt  # Discard changes in file
```

### Branching

```bash
git branch feature-name   # Create new branch
git checkout -b feature   # Create and switch to branch
git switch main           # Switch to main branch
git merge feature         # Merge feature into current branch
git branch -d feature     # Delete branch (safe)
```

### Remote Operations

```bash
git fetch                 # Fetch remote changes
git pull                  # Pull and merge remote changes
git push                  # Push to remote
git push -u origin branch # Push and set upstream
```

## Process Management

### Finding Processes

```bash
ps aux | grep node        # Find Node processes
lsof -i :3000             # Find process using port 3000
pgrep -f "vite"           # Find process by name
```

### Killing Processes

```bash
kill PID                  # Terminate process by ID
kill -9 PID               # Force kill process
killall node              # Kill all Node processes (use with caution)
```

## Network Operations

### Testing Connections

```bash
curl http://localhost:3000         # Make HTTP request
curl -I http://localhost:3000      # Get headers only
nc -zv localhost 3000              # Test if port is open
```

### Network Info

```bash
ifconfig                  # Show network interfaces (macOS)
netstat -an | grep 3000   # Show connections on port 3000
```

## File Permissions (macOS)

### View Permissions

```bash
ls -l file.txt            # View file permissions
stat -f "%A %N" file.txt  # View octal permissions (macOS)
```

### Modify Permissions

```bash
chmod +x script.sh        # Make script executable
chmod 644 file.txt        # Set read/write for owner, read for others
chmod -R 755 directory/   # Recursive permission change
```

## Environment & Path

### Environment Variables

```bash
printenv                  # Show all environment variables
echo $PATH                # Show PATH variable
export VAR=value          # Set environment variable
```

### Shell Info

```bash
echo $SHELL               # Show current shell
which pnpm                # Show path to command
```

## macOS-Specific

### Clipboard

```bash
pbcopy < file.txt         # Copy file contents to clipboard
pbpaste > file.txt        # Paste clipboard to file
```

### Opening Files

```bash
open .                    # Open current directory in Finder
open file.pdf             # Open file with default application
open -a "Visual Studio Code" . # Open directory in VS Code
```

### System Info

```bash
sw_vers                   # Show macOS version
uname -a                  # Show system information
sysctl -n hw.ncpu         # Show CPU count
```

## Package Manager (pnpm)

### Installation

```bash
pnpm install              # Install dependencies
pnpm add package          # Add dependency
pnpm add -D package       # Add dev dependency
pnpm remove package       # Remove dependency
```

### Execution

```bash
pnpm dev                  # Run dev script
pnpm build                # Run build script
pnpm run <script>         # Run any script
```

## Important Notes

### Case Sensitivity

- macOS file system is typically case-insensitive but case-preserving
- Git is case-sensitive, which can cause issues
- Be consistent with file naming

### Line Endings

- macOS uses Unix-style line endings (LF)
- Git should be configured to handle line endings properly
- Check `.gitattributes` for line ending configuration

### Permissions

- macOS has strict security features (Gatekeeper, SIP)
- Some operations may require `sudo`
- Be cautious with sudo in development

### Shell

- Default shell is zsh on modern macOS
- May have bash on older versions
- Shell scripts should specify shebang: `#!/usr/bin/env bash`
