#!/usr/bin/env python3
"""
=============================================================================
QADIAN DASHBOARD - EXPIRATION MANAGER
=============================================================================
Quickly set or update the expiration time for the GitHub Pages site.

Usage:
  python set_expiry.py now                  -> Expire the site immediately
  python set_expiry.py +1h                  -> Expire 1 hour from now
  python set_expiry.py +2h                  -> Expire 2 hours from now
  python set_expiry.py +30m                 -> Expire 30 minutes from now
  python set_expiry.py "2026-09-23 19:00"   -> Set exact time (IST)
  python set_expiry.py disable              -> Disable expiry (unrestricted access)
  python set_expiry.py --status             -> Show current expiration status

Add --no-deploy to skip automatic npm run deploy.
=============================================================================
"""

import sys
import os
import re
import datetime
import subprocess

CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "config", "accessConfig.js")

# IST is UTC + 5:30
IST_OFFSET = datetime.timezone(datetime.timedelta(hours=5, minutes=30))

def get_current_ist():
    return datetime.datetime.now(IST_OFFSET)

def update_config_file(is_active: bool, iso_timestamp: str):
    if not os.path.exists(CONFIG_PATH):
        print(f"Error: Config file not found at {CONFIG_PATH}")
        sys.exit(1)

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Update isExpiryActive
    content = re.sub(
        r"isExpiryActive:\s*(true|false),",
        f"isExpiryActive: {'true' if is_active else 'false'},",
        content
    )

    # Update expiryTimestamp
    if iso_timestamp:
        content = re.sub(
            r'expiryTimestamp:\s*"[^"]*",',
            f'expiryTimestamp: "{iso_timestamp}",',
            content
        )

    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"\n[OK] Updated accessConfig.js:")
    print(f"     isExpiryActive   : {is_active}")
    if iso_timestamp:
        print(f"     expiryTimestamp  : {iso_timestamp}")

def build_and_deploy():
    print("\n[>>] Building and deploying to GitHub Pages...")
    root_dir = os.path.dirname(os.path.abspath(__file__))
    cmd = "npm run predeploy && npm run deploy"
    res = subprocess.run(cmd, shell=True, cwd=root_dir)
    if res.returncode == 0:
        print("\n[SUCCESS] Deployed successfully to GitHub Pages!")
        print("          The new expiration rule is now LIVE for all visitors.")
    else:
        print(f"\n[ERROR] Deploy exited with code {res.returncode}")

def main():
    args = sys.argv[1:]
    deploy = True

    if "--no-deploy" in args:
        deploy = False
        args.remove("--no-deploy")

    if not args or "--status" in args:
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                c = f.read()
            active_m = re.search(r"isExpiryActive:\s*(true|false)", c)
            time_m = re.search(r'expiryTimestamp:\s*"([^"]*)"', c)
            print("Current Expiry Configuration:")
            print(f"  Active: {active_m.group(1) if active_m else 'Unknown'}")
            print(f"  Expiry Timestamp: {time_m.group(1) if time_m else 'None'}")
        print("\nPass an argument to change expiry, e.g.:")
        print("  python set_expiry.py now")
        print("  python set_expiry.py +1h")
        print("  python set_expiry.py +2h")
        print("  python set_expiry.py \"2026-09-23 20:00\"")
        print("  python set_expiry.py disable")
        return

    arg = args[0].strip().lower()
    now_ist = get_current_ist()

    if arg == "now":
        # Set to 10 minutes ago
        past_time = now_ist - datetime.timedelta(minutes=10)
        iso = past_time.strftime("%Y-%m-%dT%H:%M:%S+05:30")
        update_config_file(is_active=True, iso_timestamp=iso)
        print(f"--> Site set to EXPIRE IMMEDIATELY (timestamp: {iso})")

    elif arg == "disable" or arg == "off":
        update_config_file(is_active=False, iso_timestamp="")
        print("--> Expiry DISABLED. Site is permanently accessible.")

    elif re.match(r"^\+(\d+)([hm])$", arg):
        m = re.match(r"^\+(\d+)([hm])$", arg)
        amount = int(m.group(1))
        unit = m.group(2)
        delta = datetime.timedelta(hours=amount) if unit == 'h' else datetime.timedelta(minutes=amount)
        target_time = now_ist + delta
        iso = target_time.strftime("%Y-%m-%dT%H:%M:%S+05:30")
        update_config_file(is_active=True, iso_timestamp=iso)
        print(f"--> Expiry set to {target_time.strftime('%I:%M %p')} IST today ({iso})")

    else:
        # Try parsing as date/time string
        try:
            # e.g. "2026-09-23 19:30" or "19:30"
            val = args[0].strip()
            if len(val.split()) == 1 and ":" in val:
                # Time only, assume today
                today_str = now_ist.strftime("%Y-%m-%d")
                val = f"{today_str} {val}"
            
            parsed = datetime.datetime.strptime(val, "%Y-%m-%d %H:%M").replace(tzinfo=IST_OFFSET)
            iso = parsed.strftime("%Y-%m-%dT%H:%M:%S+05:30")
            update_config_file(is_active=True, iso_timestamp=iso)
            print(f"--> Expiry set to {parsed.strftime('%d-%b-%Y %I:%M %p')} IST ({iso})")
        except Exception as e:
            print(f"Error parsing date/time '{args[0]}': {e}")
            print("Please use format: YYYY-MM-DD HH:MM (e.g. '2026-09-23 19:30') or '+2h' or 'now'")
            sys.exit(1)

    if deploy:
        build_and_deploy()

if __name__ == "__main__":
    main()
