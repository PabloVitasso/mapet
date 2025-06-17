# Testy mapet

## Struktura testów

- test/api-whoareyou.test.js — testuje REST API (GET /, POST /ask z pytaniem "who are you")
- test/run-test.sh — uruchamia mapet w tle, czeka na start, wykonuje test API, zatrzymuje mapet

## Jak uruchomić testy

```bash
chmod +x mapet.sh stop.sh test/run-test.sh
./test/run-test.sh
```

## Co jest sprawdzane

- Czy mapet uruchamia się w tle (log, PID)
- Czy endpoint GET / odpowiada
- Czy endpoint POST /ask odpowiada na "who are you"
- Czy proces jest poprawnie zatrzymywany
- Czy logi są zapisywane do pliku YYYY.MM.DD-mapet.log

## Wynik

- Test wypisuje odpowiedzi i statusy do konsoli
- Szczegóły działania w pliku logu (np. 2025.06.18-mapet.log)