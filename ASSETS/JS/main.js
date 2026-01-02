//COSTANTI
const MSG_OBBLIGATORIO = 'Campo obbligatorio';
const LUNGH_CODICE = 3;

//const REGULAR EXPRESSION
const CODICE_REGEX = new RegExp(`^\\d{${LUNGH_CODICE}}$`);

const LS_LIBRI_KEY = 'biblioteca';

//ELEMENTI DEL DOM
const form = document.querySelector('form');
const esito = document.getElementById('esito');
const tabella = document.querySelector('table tbody');
const campiDaValidare = document.querySelectorAll('.daValidare');
const eliminaTutto = document.getElementById('deleteAll');
const inputs = document.querySelectorAll('input[type="text"]');

//ALTRE VARIABILI
let isValid = true;
let libri = localStorage.getItem(LS_LIBRI_KEY)
  ? JSON.parse(localStorage.getItem(LS_LIBRI_KEY))
  : [];

// Se nel localStorage per la nostra chiave non ce nulla, libri sarà array vuoto, altrimenti sarà popolato con gli oggetti salvati nel LS
libri.forEach((libro) => {
  popolaRigaTabella(libro);
});

//GESTIONE EVENTI
form.addEventListener('submit', (e) => {
  isValid = true; //reset della variabile
  esito.textContent = ''; //reset del messaggio esito
  e.preventDefault(); //Mette in standby la submit, non fa richiamare la action

  for (const campo of campiDaValidare) {
    validaCampo(campo);
  }

  if (isValid) {
    //Se i campi sono validi, controllo che non esista già un'altro libro con lo stesso codice. Se esiste valorizzo il campo esito e mi fermo
    if (
      libri.some((elemento) => elemento.codice === form.codice.value.trim())
    ) {
      esito.textContent = `Codice ${form.codice.value} già registrato.`;
      form.codice.focus();
    } else {
      //Se non esiste creo un oggetto libro, lo aggiungo all'array dei libri, aggiungo una riga alla tabella, metto l'array del libri nel localStorage, svuoto il form e rimetti il focus sul titolo
      let libro = new Libro(
        form.titolo.value.trim(),
        form.autore.value.trim(),
        form.genere.value,
        form.codice.value
      );
      libri.push(libro);
      //TO DO LOCAL STORAGE
      localStorage.setItem(LS_LIBRI_KEY, JSON.stringify(libri));

      //AGGIUNGO RIGA A LLA TABELLA
      popolaRigaTabella(libro);

      //SVUOTO IL FORM
      form.reset();
      form.titolo.focus();
    }
  }
});

// for (const campo of campiDaValidare) {
//   campo.addEventListener('change', () => validaCampo(campo));
// }

for (const campo of campiDaValidare) {
  campo.addEventListener('input', () => validaCampo(campo));
}

//Gestione button elimina tutto
eliminaTutto.addEventListener('click', () => {
  tabella.innerHTML = '';
  libri = [];
  localStorage.removeItem(LS_LIBRI_KEY);
  form.titolo.focus();
});

for (const campo of inputs) {
  campo.addEventListener.add('focus', () => {
    campo.classList.add('sfondoCampoFocus');
  });
  campo.addEventListener.add('blur', () => {
    campo.classList.remove('sfondoCampoFocus');
  });
}

//ALTRE FUNZIONI
function validaCampo(campo) {
  let msg = '';
  let value = campo.value.trim();
  if (campo.id == 'codice' && !CODICE_REGEX.test(value)) {
    isValid = false;
    msg = 'Richieste ' + LUNGH_CODICE + ' cifre';
  } else if (value == '') {
    isValid = false;
    msg = MSG_OBBLIGATORIO;
  }
  campo.nextElementSibling.textContent = msg;
}

function popolaRigaTabella(libro) {
  let riga = tabella.insertRow();
  riga.insertCell().innerText = libro.titolo;
  riga.insertCell().innerText = libro.autore;
  riga.insertCell().innerText = libro.genere;
  riga.insertCell().innerText = libro.codice;
}

//COSTRUTTORE
function Libro(titolo, autore, genere, codice) {
  this.titolo = titolo;
  this.autore = autore;
  this.genere = genere;
  this.codice = codice;
}
