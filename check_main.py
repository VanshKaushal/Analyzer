import subprocess
res = subprocess.run("git ls-tree -r main", shell=True, capture_output=True, text=True)
print(res.stdout)
for line in res.stdout.splitlines():
    if "frontend" in line:
        print("FOUND FRONTEND:", line)
