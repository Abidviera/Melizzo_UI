#!/bin/bash
#
# Git-crypt setup script for this repository
# Run ONCE after cloning: bash setup-git-crypt.sh
#
# Requires: git-crypt (https://github.com/AGWA/git-crypt)
#   Windows: Install via Git Bash or WSL
#   macOS: brew install git-crypt
#   Linux: apt install git-crypt (or your package manager)
#
# IMPORTANT: Generate a GPG key first if you don't have one:
#   gpg --full-generate-key
#   (Use RSA 4096, no expiry for the key)
#

set -e

echo "Setting up git-crypt encryption for this repository..."

# Check if git-crypt is installed
if ! command -v git-crypt &> /dev/null; then
    echo "ERROR: git-crypt is not installed."
    echo ""
    echo "Install git-crypt first:"
    echo "  Windows (Git Bash / WSL): apt install git-crypt"
    echo "  macOS: brew install git-crypt"
    echo "  Linux: apt install git-crypt"
    echo ""
    echo "Then re-run this script: bash setup-git-crypt.sh"
    exit 1
fi

# Initialize git-crypt if not already initialized
if [ ! -f ".git-crypt/keys/default.gpg" ]; then
    echo "Initializing git-crypt..."
    git crypt init
else
    echo "git-crypt already initialized."
fi

# Add your GPG key (replace with your actual key ID or email)
# To get your key ID: gpg --list-keys
GPG_KEY_ID="your-gpg-key-id@email.com"

echo "Adding GPG collaborator: $GPG_KEY_ID"
git crypt add-gpg-user "$GPG_KEY_ID"

# Commit the .gitattributes and setup files
git add .gitattributes setup-git-crypt.sh
git commit -m "chore: add git-crypt configuration

Protected files:
- src/environments/environment.prod.ts
- .env

Only collaborators with the GPG key can decrypt these files."

echo ""
echo "SUCCESS: git-crypt is now configured."
echo ""
echo "Next steps:"
echo "  1. Clone on a new machine: git clone <repo-url>"
echo "  2. Unlock: git crypt unlock"
echo "  3. Work normally — encrypted files auto-decrypt for authorized collaborators"
