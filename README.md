# GitHub Repository Cloning and Line Count Automation Script

This script automates the process of cloning multiple Git repositories and counting lines of code using the `cloc` (Count Lines of Code) tool. It reads a list of repository URLs from a text file (`repolist.txt`), clones each repository, and outputs detailed statistics about the source code, including the number of files, blank lines, comment lines, and actual code lines.

## Features
- Clones multiple GitHub repositories.
- Supports both public and private repositories using a Personal Access Token (PAT).
- Counts the lines of code, blank lines, comment lines, and total files using `cloc`.
- Outputs results for each repository in a clear, structured format.

## Prerequisites

Before running this script, ensure that the following tools are installed on your machine:

- **Git**: The script uses Git to clone repositories. You can install Git from [here](https://git-scm.com/downloads).
- **cloc (Count Lines of Code)**: The `cloc` tool is required to count lines of code. Install it via:
  ```bash
  sudo apt-get install cloc  # On Ubuntu
  brew install cloc          # On macOS
