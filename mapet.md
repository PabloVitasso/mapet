# mapet: uruchamianie przez firejail

## Wymagania
- firejail (Ubuntu 24.04+)
- nodejs (np. przez nvm)
- zainstalowany mapet (fork pptr-gpt)
- plik `pptr-gpt.profile` (w repo)

## Uruchamianie

```bash
chmod +x mapet.sh stop.sh test/run-test.sh
./mapet.sh
```

- mapet uruchamia się w tle, loguje do pliku YYYY.MM.DD-mapet.log
- PID procesu zapisany w .mapet.pid

## Zatrzymywanie

```bash
./stop.sh
```

## Testowanie

```bash
./test/run-test.sh
```

- Uruchamia mapet, wykonuje test API (GET /, POST /ask "who are you"), zatrzymuje mapet
- Wyniki i logi w YYYY.MM.DD-mapet.log

## mapet.sh

```bash
#!/bin/bash
LOGFILE="$(date +%Y.%m.%d)-mapet.log"
nohup env PUPPETEER_ARGS="--no-sandbox" firejail --profile=./pptr-gpt.profile node "$(cd "$(dirname "$0")"; pwd)/index.js" -s "$@" > "$LOGFILE" 2>&1 < /dev/null &
PID=$!
echo $PID > .mapet.pid
echo "Mapet started in background with PID: $PID, logging to $LOGFILE"
```

## pptr-gpt.profile

- profil firejail, minimum whitelist dla node, pptr-gpt, katalog projektu
- izoluje nodejs, nie wymaga --private

## Notatki

- Chromium uruchamiany z --no-sandbox (wymuszone przez patch w services/puppeteer.js)
- Firejail izoluje nodejs i pliki, sandbox Puppeteer wyłączony tylko dla przeglądarki
- Działa na Ubuntu 24.04 z domyślnym AppArmor/userns