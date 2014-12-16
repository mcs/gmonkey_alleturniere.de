gmonkey_alleturniere.de
=======================

Dieses Greasemonkey-Script ist für die Seite turnier.de geschrieben und ermöglicht folgendes:

* Anpassen des Layouts zur Ergebniseingabe für Badminton-Spiele, so dass die Spielpaarungen dieselbe Reihenfolge haben
  wie auf den eigenen Berichtsbögen
* Ausgrauen des nicht-erlaubten Geschlechts bei der Eingabe Gemischter Doppel (Frau darf nicht zuerst ausgewählt werden)
* Grafische Auswahl des Satzergebnisses durch Doppelklick ins Ergebnisfeld

Layout-Anpassung an eigenen Spielbogen
--------------------------------------

Mich hat immer genervt, dass man beim Übertragen der Ergebnisse den Spielbogen nicht einfach von oben nach unten
abarbeiten kann. Es mag ja Spielbögen geben, welche die Spielpaarungen exakt wie bei turnier.de vorgeben; gesehen habe
ich einen solchen Spielbogen bisher aber nicht. Mit Hilfe dieser Browser-Erweiterung ist es möglich, die Reihenfolge
der Spielbegegnungen einfach per Drag&Drop, also durch Verschieben der Zeilen mit der Maus, an den eigenen
Spielberichtsbogen anzupassen. Das geänderte Layout kann anschießend gespeichert werden, damit beim nächsten Spieltag
die Neusortierung nicht erneut vorgenommen werden muss.

Hier ein Beispiel-Video: TODO:LinkZuYoutube

Ausgrauen des falschen Geschlechts bei GD
-----------------------------------------

Beim Gemischten Doppel muss erst der Herr und dann die Dame eingetragen werden. Technisch erzwungen wird das leider
nicht. Das holt diese Erweiterung nach: Das jeweils nicht-erlaubte Geschlecht wird deaktiviert, so dass nur gültige
Eingaben möglich sind.

Grafische Auswahl des Satzergebnisses
-------------------------------------

Die Eingabe der Ergebnisse erfordert stets einen Wechsel von der Maus zur Tastatur, da alle anderen Angaben per
Mausklick erledigt werden müssen. Damit der Wechsel nicht mehr nötig ist, öffnet sich nun durch einen Doppelklick in ein
Eingabefeld eine Tabelle mit allen möglichen Satzergebnissen. Ein Klick auf das gewünschte Ergebnis überträgt es in das
Eingabefeld. Kein Griff zur Tastatur mehr nötig.

Technische Voraussetzungen
==========================

Damit die Erweiterung eingesetzt werden kann, benötigt man entweder den Browser [Firefox][1] mit installierter
Erweiterung [Greasemonkey][2], oder den Browser [Chrome][3] mit der Erweiterung [Tampermonkey][4]. Besitzt man einen
solchen Browser, kann die
[Erweiterung][5]
einfach in den Browser installiert werden. Beim nächsten Besuch der Ergebnis-Eingabemaske ist es dann automatisch aktiv.

[1]: https://www.mozilla.org/firefox/new/ "Firefox"
[2]: https://addons.mozilla.org/de/firefox/addon/greasemonkey/ "Greasemonkey"
[3]: http://www.google.com/intl/de_de/chrome/browser/ "Chrome"
[4]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo "Tampermonkey"
[5]: https://github.com/mcs/gmonkey_alleturniere.de/raw/master/alleturniere.de_Umsortierung.user.js "Script"
