# Aplicatie-web-Booking-Psihologi

# Rezumat Aplicație - Booking Psihologi

Această aplicație este o platformă de rezervare pentru programări cu psihologi. Este dezvoltată folosind tehnologiile Node.js, TypeScript și React cu Vite și TypeScript.

## Descriere

Aplicația de Booking Psihologi facilitează rezervarea de ședințe cu psihologi autorizați. Utilizatorii pot căuta și vizualiza profilurile psihologilor, apoi pot alege un psiholog potrivit pentru ei și pot rezerva o ședință în funcție de disponibilitatea acestuia. Utilizatorii pot completa detaliile necesare și primi confirmarea programării.

## Tehnologii

- Backend: Node.js, Express.js, TypeScript
- Frontend: React cu Vite, Bootstrap, TypeScript
- Stocarea datelor: MySQL

## Caracteristici Cheie

- Cautare, folosind informatii despre specializari, servicii, locatia cabinetelor, nume si prenume psiholog și vizualizare profiluri psihologi
- Rezervare de sedinte cu psihologi prin generarea intervalelor disponibile
- Confirmarea programarilor de catre psihologi
- Integrarea programarilor in calendarul personal
- Administrare si actualizare a profilurilor psihologilor
- Sistem de autentificare si securitate pentru utilizatori si psihologi
- Sistem de notificare prin email

## Cerințe de Instalare și Rulare

Pentru a instala și rula aplicația local, urmați pașii de mai jos:

1. Clonează acest repository folosind `git clone https://github.com/mirceaivs/Aplicatie-web-Booking-Psihologi.git`
2. Navigheaza in branch-ul unde este backend-ul `git checkout backend`
3. Instalează dependințele: `npm install`
4. Importeaza baza de date folosind fisierele .sql din folder-ul Baza de date
5. Ruleaza REST API-ul: `npm start`
6. Navigheaza in branch-ul unde este frontend-ul `git checkout frontend`
7. Instaleaza dependintele: `npm install`
8. Ruleaza frontend-ul folosind: `npm run dev`
9. TESTARE: Cautarea unui psiholog:
    - dupa nume: `nume`, `iulian`
    - dupa locatie: judet: `constanta`, localitate: `mangalia`
    

## Contact

Pentru întrebări sau clarificări, vă rugăm sa ma contactati la adresa [mircea.ivascu17@gmail.com](mailto:mircea.ivascu17@gmail.com).

## Disclaimer

Aceasta este o aplicație fictiva creata in scop educational. Numele și datele prezentate sunt fictive si nu reprezinta o aplicatie sau serviciu real.

