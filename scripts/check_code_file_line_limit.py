#!/usr/bin/env python3
"""
Code File Line Guardrail

Detects files that cross a line-count threshold in a given diff.
A violation is triggered when a file transitions from under the threshold
to at or above it — encouraging small files without penalising existing ones.

Modes:
  ci     -- diff between two git refs (used in GitHub Actions)
  local  -- diff between HEAD and working tree staged files (used manually)

Output per violation (machine-readable, one per line):
  VIOLATION|<file>|<old_lines>|<new_lines>|<reason>
"""

import argparse
import subprocess
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CODE_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".css", ".scss",
}

IGNORED_DIRS = {
    "node_modules", ".next", ".git", "dist", "build", "coverage",
}


# ---------------------------------------------------------------------------
# Git helpers (SRP)
# ---------------------------------------------------------------------------

def git(*args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        capture_output=True,
        text=True,
        check=True,
    )
    return result.stdout


def get_changed_files_ci(base_ref: str, head_ref: str) -> list[str]:
    """Returns files changed between two refs (added or modified)."""
    output = git("diff", "--name-only", "--diff-filter=AM", base_ref, head_ref)
    return [f for f in output.splitlines() if f]


def get_changed_files_local() -> list[str]:
    """Returns staged files (added or modified) in the working tree."""
    output = git("diff", "--name-only", "--diff-filter=AM", "--cached")
    return [f for f in output.splitlines() if f]


def count_lines_at_ref(filepath: str, ref: str) -> int:
    """Returns the line count of a file at a given git ref. 0 if not found."""
    try:
        content = git("show", f"{ref}:{filepath}")
        return len(content.splitlines())
    except subprocess.CalledProcessError:
        return 0


def count_lines_on_disk(filepath: str) -> int:
    """Returns the current line count of a file on disk."""
    path = Path(filepath)
    if not path.exists():
        return 0
    return len(path.read_text(encoding="utf-8", errors="replace").splitlines())


# ---------------------------------------------------------------------------
# Filtering (SRP)
# ---------------------------------------------------------------------------

def is_code_file(filepath: str) -> bool:
    path = Path(filepath)
    if any(part in IGNORED_DIRS for part in path.parts):
        return False
    return path.suffix in CODE_EXTENSIONS


# ---------------------------------------------------------------------------
# Violation detection (SRP)
# ---------------------------------------------------------------------------

def check_file_ci(
    filepath: str,
    base_ref: str,
    head_ref: str,
    threshold: int,
) -> dict | None:
    old_lines = count_lines_at_ref(filepath, base_ref)
    new_lines = count_lines_at_ref(filepath, head_ref)

    crossed = old_lines < threshold <= new_lines
    if not crossed:
        return None

    reason = (
        f"File crossed the {threshold}-line threshold "
        f"({old_lines} → {new_lines} lines)"
    )
    return {"file": filepath, "old_lines": old_lines, "new_lines": new_lines, "reason": reason}


def check_file_local(filepath: str, threshold: int) -> dict | None:
    old_lines = count_lines_at_ref(filepath, "HEAD")
    new_lines = count_lines_on_disk(filepath)

    crossed = old_lines < threshold <= new_lines
    if not crossed:
        return None

    reason = (
        f"File crossed the {threshold}-line threshold "
        f"({old_lines} → {new_lines} lines)"
    )
    return {"file": filepath, "old_lines": old_lines, "new_lines": new_lines, "reason": reason}


# ---------------------------------------------------------------------------
# Reporting (SRP)
# ---------------------------------------------------------------------------

def print_violation(v: dict) -> None:
    print(f"VIOLATION|{v['file']}|{v['old_lines']}|{v['new_lines']}|{v['reason']}")


def print_summary(violations: list[dict], threshold: int) -> None:
    print(f"\nChecked files against {threshold}-line threshold.")
    if violations:
        print(f"  {len(violations)} violation(s) found:")
        for v in violations:
            print(f"  - {v['file']}: {v['old_lines']} → {v['new_lines']} lines")
    else:
        print("  No violations found.")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=["ci", "local"], required=True)
    parser.add_argument("--threshold", type=int, default=500)
    parser.add_argument("--base-ref", default="origin/main")
    parser.add_argument("--head-ref", default="HEAD")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.mode == "ci":
        changed_files = get_changed_files_ci(args.base_ref, args.head_ref)
    else:
        changed_files = get_changed_files_local()

    code_files = [f for f in changed_files if is_code_file(f)]

    violations = []
    for filepath in code_files:
        if args.mode == "ci":
            result = check_file_ci(filepath, args.base_ref, args.head_ref, args.threshold)
        else:
            result = check_file_local(filepath, args.threshold)

        if result:
            print_violation(result)
            violations.append(result)

    print_summary(violations, args.threshold)
    return 1 if violations else 0


if __name__ == "__main__":
    sys.exit(main())
