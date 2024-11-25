// Evento de mousedown en una letra
wheelContainer.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('wheel-letter')) {
        isDrawing = true;
        const startLetter = event.target;
        startLetter.classList.add('selected');
        selectedLetters.push(startLetter);

        // Obtiene el centro la primera letra elegida
        const [relativeStartX, relativeStartY] = getRelativeElementCenter(startLetter);
        lastLetterCenter = [relativeStartX, relativeStartY];

        // Crea la primera línea
        currentLine = createLine(relativeStartX, relativeStartY);

        // Crea una variable para guardar la palabra seleccionada
        let word = "";

        // Definimos las funciones de evento aquí para que tengan acceso a las variables necesarias
        onMouseMove = (moveEvent) => {
            if (!isDrawing) return;

            // Obtiene la posición del ratón
            const wheelRect = wheelContainer.getBoundingClientRect();
            const relativeMouseX = moveEvent.pageX - wheelRect.left;
            const relativeMouseY = moveEvent.pageY - wheelRect.top;

            // Actualiza la línea
            const { length, angle } = lengthAndAngle(lastLetterCenter, [relativeMouseX, relativeMouseY]);
            currentLine.style.width = `${length}px`;
            currentLine.style.transform = `rotate(${angle}deg)`;
        };

        onMouseOver = (overEvent) => {
            if (!isDrawing || !overEvent.target.classList.contains('wheel-letter')) return;

            const newLetter = overEvent.target;

            // Evita seleccionar la misma letra varias veces
            if (selectedLetters.includes(newLetter)) return;

            newLetter.classList.add('selected');
            selectedLetters.push(newLetter);

            // Fija la línea actual en el centro de la nueva letra
            const [relativeEndX, relativeEndY] = getRelativeElementCenter(newLetter);

            const { length, angle } = lengthAndAngle(lastLetterCenter, [relativeEndX, relativeEndY]);
            currentLine.style.width = `${length}px`;
            currentLine.style.transform = `rotate(${angle}deg)`;

            // Actualiza lastLetterCenter en el centro de la nueva letra
            lastLetterCenter = [relativeEndX, relativeEndY];

            // Crea una nueva línea desde la nueva letra hasta el ratón
            currentLine = createLine(relativeEndX, relativeEndY);
        };

        onMouseUp = () => {
            isDrawing = false;

            // Construye la palabra seleccionada a partir de las letras
            word = selectedLetters.map(letter => letter.textContent).join('');

            // Verifica si la palabra existe en el juego
            let wordPosition;
            try {
                wordPosition = game.findWord(word);
            } catch (error) {
                console.log(`La palabra "${word}" no está en el juego.`);
                word = "";
            }

            if (wordPosition) {
                updateBoardWithWord(wordPosition, word);
                console.log('Resultado de findWord:', wordPosition);
            }

            // Resetea la selección y los eventos
            resetSelection();

            // Imprime la palabra seleccionada en la consola
            console.log('Palabra seleccionada:', word);
        };

        // Añade los eventos
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mouseover', onMouseOver);
    }
});