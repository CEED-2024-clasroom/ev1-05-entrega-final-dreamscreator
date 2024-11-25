import './styles/styles.css';
import './lib/fontawesome';
import { Game } from './lib/Game';
import center from './lib/center';
import calculateLetterPositions from './lib/letter_positions';
import { getElementCenter, lengthAndAngle } from './lib/line_position';

// Declara id null para la aparición de tableros sea aleatoria
const id = null;

// Declara game usando el aletaroio de Game.js al ser id null y wordPositions de Game.js para su uso posterior
const game = new Game(id);
const wordPositions = game.wordPositions;

// Declara las variables para calcular el desplazamiento
const gridWidth = 10;
const gridHeight = 10;
let maxColumn = 0;
let maxRow = 0;

// Calcula maxColumn y maxRow a partir de wordPositions que viene desde Game.js
wordPositions.forEach(position => {
  const { origin, direction, length } = position;
  const [startX, startY] = origin;

  // Calcula el máximo de tamaño del tablero en base a la dirección y longitud de la palabra
  if (direction === 'horizontal') {
    maxColumn = Math.max(maxColumn, startX + length - 1);
    maxRow = Math.max(maxRow, startY);
  } else if (direction === 'vertical') {
    maxColumn = Math.max(maxColumn, startX);
    maxRow = Math.max(maxRow, startY + length - 1);
  }
});

// Calcula el desplazamiento x e y con la función center de center.js pasándole el maxColumn y maxRow calculado anteriormente y el tamaño que se ha declarado anteriormente de gridWidth y gridHeight
const [despx, despy] = center(maxColumn, maxRow, gridWidth, gridHeight);

// Crea una variable con el grid extraido del html a través de id
const gridContainer = document.getElementById('grid');

// Elimina el contenido previo que hubiera en el grid
gridContainer.innerHTML = '';

// Crea un objeto dónde se almacenará los divs del html con classe letter por su posición
const letterDivs = {};

// Crea un array dónde se almacenará las posiciones del grid que no han sido reveladas todavía
const unrevealedPositions = [];

// Refactorizamos la función para reducir la complejidad
wordPositions.forEach(position => {
  const { origin, direction, length } = position;
  const [startX, startY] = origin;

  // Calcula deltaX y deltaY basado en la dirección de las palabras del tablero
  const deltaX = direction === 'horizontal' ? 1 : 0;
  const deltaY = direction === 'vertical' ? 1 : 0;

  // Crea los divs para las letras en base a las palabras y su longitud de wordPositions de Game.js
  for (let i = 0; i < length; i++) {
    // Crea un div para la letra de la palabra y le asigna la clase letter
    const letterDiv = document.createElement('div');
    letterDiv.classList.add('letter');

    // Calcula la posición en grid de esa letra
    const row = startY + despy + deltaY * i + 1;
    const column = startX + despx + deltaX * i + 1;

    // Coloca letterDiv en la posición correspondiente
    letterDiv.style.gridArea = `${row} / ${column}`;

    // Calcula las posiciones lógicas
    const letterX = startX + deltaX * i;
    const letterY = startY + deltaY * i;

    // Almacena letterDiv en letterDivs usando la posición como clave
    const key = `${letterX},${letterY}`;
    letterDivs[key] = letterDiv;

    // Agrega atributos de datos para x e y
    letterDiv.dataset.x = letterX;
    letterDiv.dataset.y = letterY;

    // Añade letterDiv al gridContainer
    gridContainer.appendChild(letterDiv);

    // Agrega la posición a las posiciones no reveladas en caso de que no haya sido agregada ya para evitar las posiciones de las palabras que se cruzan entre sí
    if (!unrevealedPositions.some(pos => pos.x === letterX && pos.y === letterY)) {
      unrevealedPositions.push({ x: letterX, y: letterY });
    }
  }
});

// Crea una variable para guardar las letras desde Game.js
const letters = game.letters;

// Crea una variable con el elemento con id #wheel del html
const wheelContainer = document.getElementById('wheel');

// Elimina el contenido previo de wheel
wheelContainer.innerHTML = '';

// Calcula las posiciones de las letras en el círculo usando la función incluida en letter_positions.js
let positions = calculateLetterPositions(letters.length);

// Crea un array para almacenar las letras de la rueda
const wheelLetterDivs = [];

// Recorre cada letra y aplica las posiciones calculadas
letters.split('').forEach((letter, index) => {
  const { left, top } = positions[index];

  // Crea un div para cada una de las letras y la incluye, además inclye la classe .wheel-letter
  const letterDiv = document.createElement('div');
  letterDiv.classList.add('wheel-letter');
  letterDiv.textContent = letter;

  // Usa las posiciones calculadas y agrega los estilos a los divs con clase letter
  letterDiv.style.position = 'absolute';
  letterDiv.style.left = left;
  letterDiv.style.top = top;

  // Añade el div creado al div con clase wheel
  wheelContainer.appendChild(letterDiv);

  // Almacena el div creado en el array
  wheelLetterDivs.push(letterDiv);
});

// Guarda en distintas variables los botones de mezcla, bombilla, diana y martillo del html
const mixButton = document.querySelector('.tools.left .tool .fa-shuffle').parentElement;
const lightbulbButton = document.querySelector('.tools.right .tool .fa-lightbulb').parentElement;
const targetButton = document.querySelector('.tools.left .tool .fa-expand').parentElement;
const hammerButton = document.querySelector('.tools.right .tool .fa-hammer').parentElement;

// Guarda en variables los elementos con id black y con id grid
const blackDiv = document.getElementById('black');
const gridDiv = document.getElementById('grid');

// Función para mezclar las posiciones de un array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Agrega una función al botón de mezcla que se dispara cuando se hace click en el botón
mixButton.addEventListener('click', () => {
  // Mezcla de una copia de positions para evitar modificar el original usando la función de mezclas las posiciones de un array
  const shuffledPositions = positions.slice();
  shuffleArray(shuffledPositions);

  // Asigna las nuevas posiciones a los divs con clase letter ya existentes
  wheelLetterDivs.forEach((letterDiv, index) => {
    const { left, top } = shuffledPositions[index];
    letterDiv.style.left = left;
    letterDiv.style.top = top;
  });
});

// Agrega una función al botón bombilla para revelar al azar una letra del tablero cuando se hace click en el botón
lightbulbButton.addEventListener('click', () => {
  // Primero comprueba si las letras reveladas es igual a cero, o sea que todo el tablero está revelado
  if (unrevealedPositions.length === 0) {
    return;
  }

  // Selecciona una posición no revelada al azar y la guarda en la variable
  const randomIndex = Math.floor(Math.random() * unrevealedPositions.length);
  // Elimina de unrevealedPositions la posición de la letra que se va a revelar
  const position = unrevealedPositions.splice(randomIndex, 1)[0];

  // Guarda en variables las posiciones, key y el div de la letra que se va a revelar y ha sido elegida al azar anteriormente
  const x = position.x;
  const y = position.y;
  const key = `${x},${y}`;
  const letterDiv = letterDivs[key];

  // Si existe un div con la clase letter entonces le añade al contenido del div la letra correspondiente a las coordenadas que tocan
  if (letterDiv) {
    const letter = game.letterAt(x, y);
    letterDiv.textContent = letter;
  }
});

// Agrega una función al botón ayuda para revelar al azar cinco letras del tablero cuando se hace click en el botón
targetButton.addEventListener('click', () => {
  // Primero comprueba si las letras reveladas es igual a cero, o sea que todo el tablero está revelado
  if (unrevealedPositions.length === 0) {
    return;
  }

  // Guarda en una variable el número de posiciones a revelar, escogiendo el número menor entre cinco y el total de posiciones por revelar
  const lettersToReveal = Math.min(5, unrevealedPositions.length);

  for (let i = 0; i < lettersToReveal; i++) {
    // Selecciona una posición no revelada al azar y la guarda en la variable
    const randomIndex = Math.floor(Math.random() * unrevealedPositions.length);
    // Elimina de unrevealedPositions la posición de la letra que se va a revelar
    const position = unrevealedPositions.splice(randomIndex, 1)[0];

    // Guarda en variables las posiciones, key y el div de la letra que se va a revelar y ha sido elegida al azar anteriormente
    const x = position.x;
    const y = position.y;
    const key = `${x},${y}`;
    const letterDiv = letterDivs[key];

    // Si existe un div con la clase letter entonces le añade al contenido del div la letra correspondiente a las coordenadas que tocan
    if (letterDiv) {
      const letter = game.letterAt(x, y);
      letterDiv.textContent = letter;
    }
  }
});

// La posición de las tres siguientes funciones ha venido determinada por su momento de uso, porque sino había fallos de declaración antes de su uso

// Función usada en el botón del martillo usada para eliminar una posición no revelada de la variable unrevealedPositions
function removePositionFromUnrevealed(x, y) {
  // Busca la posición index que coincida con x e y e guarda en index, si no hay coincidencias devuelve -1
  const index = unrevealedPositions.findIndex(pos => pos.x === x && pos.y === y);
  // Si encuentra coincidencias elimina de unrevealedPositions la posición que coincidia con las coordenadas
  if (index !== -1) {
    unrevealedPositions.splice(index, 1);
  }
}

// Función usada en la función updateBoardWithWord y que usa la función removePositionFromUnrevealed para actualizar un div con la clase letter
function updateLetterDiv(x, y, letter) {
  // Guarda en la variable la key en base a los parametros x e y introducidos
  const key = `${x},${y}`;
  // Guarda en una varialbe el div con clase letter que coincida con la key
  const letterDiv = letterDivs[key];
  // Si existe un div y se ha guardado en la variable le pondrá en el contenido la letra introducida y pasará la función para eliminar esa posición de la lista de posiciones sin revelar
  if (letterDiv) {
    letterDiv.textContent = letter;
    removePositionFromUnrevealed(x, y);
  }
}

// Función para actualizar el tablero con la palabra encontrada
function updateBoardWithWord(wordPosition, word) {
  // Guarda en una variable las coordenadas de inicio y la dirección de la palabra a través de wordPosition en Game.js
  const { origin, direction } = wordPosition;
  // Guarda las coordenadas de inicio en dos variables distintas
  const [startX, startY] = origin;
  // Guarda las posiciones delta en base a la dirección
  const deltaX = direction === 'horizontal' ? 1 : 0;
  const deltaY = direction === 'vertical' ? 1 : 0;

  // Actualiza los divs con clase letter en el tablero con las letras de la palabra
  for (let i = 0; i < word.length; i++) {
    const x = startX + deltaX * i;
    const y = startY + deltaY * i;
    updateLetterDiv(x, y, word[i]);
  }
}

// Agrega una función al botón martillo para revelar las casillas sin revelar cuando se hace click en ellas y se cierra cuando haces click fuera de ellas
hammerButton.addEventListener('click', () => {
  // Declara las variables necesarias para la función
  let endHammerHelp;
  let onDocumentClick;

  // Define la función onDocumentClick
  onDocumentClick = function (event) {
    // Verifica si se hizo click en un div con la clase letter
    if (event.target.classList.contains('letter')) {
      // Verifica si la letra está en una posición sin revelar si es muestra el contenido añadiendo la letra corespondiente al div
      if (event.target.textContent === '') {
        // Guarda en una variable dónde se ha hecho click
        const letterDiv = event.target;
        // Guarda las coordenadas del div dónde se ha hecho click
        const x = parseInt(letterDiv.dataset.x);
        const y = parseInt(letterDiv.dataset.y);
        // Guarda la letra que corresponde a las coordenadas y lo agrega al contenido del div
        const letter = game.letterAt(x, y);
        letterDiv.textContent = letter;
        // Usa las coordenadas para pasar la función que elimina esa posición de las posiciones sin revelar
        removePositionFromUnrevealed(x, y);
      } else {
        // Si la letra ya está revelada la función no hace nada
      }
    } else if (
      // Si el click se hace en un div que no tiene la clase letter y que no contiene el botón de martillo se aplica la función de finalizar martillo
      !event.target.classList.contains('letter') &&
      !hammerButton.contains(event.target)
    ) {
      endHammerHelp();
    }
  };

  // Se define la función de finalizar martillo
  endHammerHelp = function () {
    // Añade la clase hidden al div black
    blackDiv.classList.add('hidden');
    // Quita la clase on-top al div grid
    gridDiv.classList.remove('on-top');
    // Quita el evento de click en el grid
    document.removeEventListener('click', onDocumentClick);
  };

  // Quita la clase hidden al div black
  blackDiv.classList.remove('hidden');
  // Añade la clase on-top al div grid
  gridDiv.classList.add('on-top');

  // Añade el evento después de definir ambas funciones
  document.addEventListener('click', onDocumentClick);
});

// Crea las variables necesarias para el dibujo de las líneas y eventos
let isDrawing = false;
let selectedLetters = [];
let currentLine = null;
let lastLetterCenter = null;

// Declara las funciones de evento con anterioridad para que no haya problemas de declaraciones posteriores a su uso
let onMouseMove = null;
let onMouseUp = null;
let onMouseOver = null;

// Función para crear una línea que va de letra a letra en el wheel
function createLine(x, y) {
  // Guarda en una variable un elemento div
  const line = document.createElement('div');
  // Le agrega al div la clase line, la posición abolute y las posiciones definidas de xy y se lo agrega al wheel
  line.classList.add('line');
  line.style.position = 'absolute';
  line.style.left = `${x}px`;
  line.style.top = `${y}px`;
  wheelContainer.appendChild(line);
  return line;
}

// Función para obtener el centro como referencia usando la función getElementCenter de line_position.js
function getRelativeElementCenter(element) {
  // Guarda en una variable las coordenadas indicadas por la función getElementCenter de line_position.js
  const { x, y } = getElementCenter(element);
  // Guarda en una variable las coordenadas y dimensiones de wheel
  const wheelRect = wheelContainer.getBoundingClientRect();
  // Devuelve el centro restanto a xy el left y el top de wheel
  return [
    x - wheelRect.left,
    y - wheelRect.top
  ];
}

// Función para resetear la selección de letras y los eventos
function resetSelection() {
  // Elimina todas las clases line del html de manera que se eliminan las líneas
  document.querySelectorAll('.line').forEach(line => line.remove());
  // Elimina la clase selected de las letras que puedan tenerlo
  selectedLetters.forEach(letter => letter.classList.remove('selected'));
  // Vacía el array de letras seleccionadas
  selectedLetters = [];
  // Deja en null la variable de la última letra
  lastLetterCenter = null;

  // Elimina los eventos para evitar que se sigan ejecutando
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('mouseover', onMouseOver);
}

// Evento cuando se pincha el ratón en una letra pero antes de soltar el botón del ratón
wheelContainer.addEventListener('mousedown', (event) => {
  // Si el lugar dónde se ha apretado el ratón contiene la clase wheel-letter se ejecuta el código
  if (event.target.classList.contains('wheel-letter')) {
    // La variable isDrawing se declara como true
    isDrawing = true;
    // Se guarda en una variable dónde se ha apretado el ratón por primera vez, teniendo la primera letra seleccionada
    const startLetter = event.target;
    // Se le agrega la clase selected
    startLetter.classList.add('selected');
    // Se agrega a la variable selectedLetters el contenido de la variable startLetter
    selectedLetters.push(startLetter);

    // Guarda en una variable el centro de la letra inicial seleccionada
    const [relativeStartX, relativeStartY] = getRelativeElementCenter(startLetter);
    // Guarda los mismos datos en la variable de la última letra seleccionada
    lastLetterCenter = [relativeStartX, relativeStartY];

    // Crea una nueva línea usando la función creada anteriormente y la guarda en una variable
    currentLine = createLine(relativeStartX, relativeStartY);

    // Crea una variable para guardar la palabra seleccionada
    let word = "";

    // Define el evento cuando el ratón se mueve y isDrawing es true, lo cual ocurre mientras el botón del ratón está apretado y no se ha soltado
    onMouseMove = (moveEvent) => {
      if (!isDrawing) return;

      // Guarda en un variable las coordenadas del contenedor wheel
      const wheelRect = wheelContainer.getBoundingClientRect();
      // Guarda las coordenadas del ratón en referente al documento
      const relativeMouseX = moveEvent.pageX - wheelRect.left;
      const relativeMouseY = moveEvent.pageY - wheelRect.top;

      // Usa la función lenghtAndAngle de line_position.js y la guarda en una variable
      const { length, angle } = lengthAndAngle(lastLetterCenter, [relativeMouseX, relativeMouseY]);
      // Modifica el elemento currentLine del html para que tenga la distancia y la dirección que corresponde
      currentLine.style.width = `${length}px`;
      currentLine.style.transform = `rotate(${angle}deg)`;
    };

    // Define el evento cuando el ratón pasa por encima de una letra del wheel, sin haber soltado el botón del ratón y si isDrawing es true
    onMouseOver = (overEvent) => {
      if (!isDrawing || !overEvent.target.classList.contains('wheel-letter')) return;

      // Guarda en una variable por dónde ha pasado el ratón
      const newLetter = overEvent.target;

      // Si por dónde ha pasado el ratón es una letra ya seleccionada sale del evento
      if (selectedLetters.includes(newLetter)) return;

      // Agrega la clase selected a la letra por la que ha pasado el ratón y la agrega a las letras seleccionadas
      newLetter.classList.add('selected');
      selectedLetters.push(newLetter);

      // Fija la línea actual en el centro de la nueva letra
      const [relativeEndX, relativeEndY] = getRelativeElementCenter(newLetter);

      // Usa la función lenghtAndAngle de line_position.js y la guarda en una variable
      const { length, angle } = lengthAndAngle(lastLetterCenter, [relativeEndX, relativeEndY]);
      // Modifica el elemento currentLine del html para que tenga la distancia y la dirección que corresponde
      currentLine.style.width = `${length}px`;
      currentLine.style.transform = `rotate(${angle}deg)`;

      // Actualiza lastLetterCenter en el centro de la nueva letra
      lastLetterCenter = [relativeEndX, relativeEndY];

      // Crea una nueva línea desde la nueva letra hasta el ratón y la guarda en la variable
      currentLine = createLine(relativeEndX, relativeEndY);
    };

    // Define el evento cuando se suelta el botón del ratón
    onMouseUp = () => {
      // Se definte isDrawing como false
      isDrawing = false;

      // Guarda en la variable word la palabra a partir de las letras seleccionadas anteriormente
      word = selectedLetters.map(letter => letter.textContent).join('');

      // Declara la variable wordPosition
      let wordPosition;
      try {
        // Verifica si la palabra existe en el juego a través de la función findWord de Game.js y la guarda en wordPosition
        wordPosition = game.findWord(word);
      } catch (error) {
        // Si no existe deja word en blanco
        word = "";
      }

      // Si hay una palabra en wordPosition se ejecuta el código
      if (wordPosition) {
        // Se llama a la función que actualiza el tablero pasándole los parametros de wordPosition y word
        updateBoardWithWord(wordPosition, word);
      }

      // Resetea la selección y los eventos
      resetSelection();
    };

    // Añade los tres eventos
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
  }
});
