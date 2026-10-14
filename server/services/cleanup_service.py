import os
import shutil
import time
from pathlib import Path

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(parents=True, exist_ok=True)

def cleanup_old_files(max_age_seconds: int = 1800):
    """
    Remove files in the temporary directory older than max_age_seconds (default 30 mins).
    Preserves user privacy and prevents disk bloat.
    """
    now = time.time()
    for item in TEMP_DIR.glob("*"):
        try:
            if item.is_file() and (now - item.stat().st_mtime) > max_age_seconds:
                item.unlink(missing_ok=True)
            elif item.is_dir() and (now - item.stat().st_mtime) > max_age_seconds:
                shutil.rmtree(item, ignore_errors=True)
        except Exception:
            pass
