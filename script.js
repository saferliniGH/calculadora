// Creacion del parser matematico con suma, resta, multiplicacion y division 
// Tokenización
function tokenize(expression) {
    const tokens = [];
    let numberBuffer = '';

    for (let char of expression) {
        if (/\d/.test(char) || char === '.') {
            numberBuffer += char; // Construir números completos (incluyendo decimales)
        } else if (/[+\-*/()]/.test(char)) {
            if (numberBuffer) {
                tokens.push(numberBuffer); // Empujar número acumulado
                numberBuffer = '';
            }
            tokens.push(char); // Empujar operador o paréntesis
        }
    }

    if (numberBuffer) {
        tokens.push(numberBuffer); // Empujar último número si existe
    }

    return tokens;
}

// Parsing
function parse(tokens) {
    const outputQueue = [];
    const operatorStack = [];

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    const associativity = {
        '+': 'L',
        '-': 'L',
        '*': 'L',
        '/': 'L'
    };

    while (tokens.length) {
        const token = tokens.shift();

        if (/\d/.test(token)) {
            outputQueue.push(parseFloat(token)); // Número al output
        } else if (/[+\-*/]/.test(token)) {
            while (operatorStack.length && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token] && associativity[token] === 'L') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop(); // Eliminar '('
        }
    }

    while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
}

// Evaluación
function evaluateRPN(rpn) {
    const stack = [];

    for (let token of rpn) {
        if (typeof token === 'number') {
            stack.push(token);
        } else {
            const b = stack.pop();
            const a = stack.pop();

            switch (token) {
                case '+':
                    stack.push(a + b);
                    break;
                case '-':
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(a * b);
                    break;
                case '/':
                    stack.push(a / b);
                    break;
            }
        }
    }

    return stack[0];
}

// Función principal para calcular la expresión
function calculate(expression) {
    const tokens = tokenize(expression);
    const rpn = parse(tokens);
    const result = evaluateRPN(rpn);
    return result;
}

//Agregando el parser para calcular

// Crear una función para reproducir sonido
function playSound() {
    const audio = new Audio('sounds/click.mp3');
    audio.play();
}

// Variables globales
let displayContent = '';

// Actualiza el display
function updateDisplay() {
    document.getElementById('display').value = displayContent;
}

// Añadir número al display
function appendNumber(number) {
    playSound(); // Reproducir sonido al presionar el botón
    displayContent += number;
    updateDisplay();
}

// Añadir punto decimal
function appendDot() {
    playSound(); // Reproducir sonido al presionar el botón
    if (!displayContent.endsWith('.')) {
        displayContent += '.';
        updateDisplay();
    }
}

// Establecer operación
function setOperation(op) {
    playSound(); // Reproducir sonido al presionar el botón
    if (displayContent === '') return;
    if (endsWithOperator()) {
        displayContent = displayContent.slice(0, -1); // Reemplaza el último operador
    }
    displayContent += op;
    updateDisplay();
}

// Calcular resultado
function calculateResult() {
    playSound(); // Reproducir sonido al presionar el botón
    try {
        const result = calculate(displayContent); // Utiliza el parser
        displayContent = result.toString();
    } catch (e) {
        displayContent = 'Error';
    }
    updateDisplay();
}

// Limpiar display
function clearDisplay() {
    playSound(); // Reproducir sonido al presionar el botón
    displayContent = '';
    updateDisplay();
}

// Borrar el último número
function backspace() {
    playSound(); // Reproducir sonido al presionar el botón
    displayContent = displayContent.slice(0, -1); // Elimina el último carácter
    updateDisplay();
}

// Verificar si el display termina con un operador
function endsWithOperator() {
    return ['+', '-', '*', '/'].includes(displayContent.slice(-1));
}

// Implementar un parser básico (esto puede ser más avanzado dependiendo de tus necesidades)
function calculate(expression) {
    return Function('"use strict";return (' + expression + ')')(); // Evalúa la expresión matemática
}