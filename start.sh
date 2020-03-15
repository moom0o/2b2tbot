until node index.js; do
    echo "Server 'node index.js' crashed with exit code $?.  Respawning.." >&2
    sleep 60
done
