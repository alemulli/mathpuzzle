// TODO: if there is only 1 step regenerate the puzzle because it needs a minumum of 2 steps for it to actually be a puzzle

function generatePuzzle() {
    const targetRange = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const operations = [
      { name: "addition", symbol: "+", color: "blue", operate: (a, b) => a + b, type: "additive" },
      { name: "subtraction", symbol: "-", color: "yellow", operate: (a, b) => a - b, type: "additive" },
      { name: "multiplication", symbol: "*", color: "pink", operate: (a, b) => a * b, type: "multiplicative" },
      { name: "division", symbol: "/", color: "purple", operate: (a, b) => (a % b === 0 ? a / b : null), type: "multiplicative" },
    ];
    const maxOperations = 4;
    let currentResult = 0;
    const puzzleSteps = [];
    let movedToMultiplicative = false;
  
    // First operation (always addition)
    const firstNumber = targetRange[Math.floor(Math.random() * targetRange.length)];
    currentResult = firstNumber;
    puzzleSteps.push({ number: firstNumber, operation: operations[0] });
  
    // Generate subsequent operations
    for (let i = 1; i < maxOperations; i++) {
      let possibleOperations = operations.slice();
  
      if (movedToMultiplicative) {
        possibleOperations = possibleOperations.filter(op => op.type === "multiplicative");
      }
  
      let validOperationFound = false;
      let attempts = 0;
      const maxAttempts = 10; // Limit attempts to prevent infinite loops
  
      while (attempts < maxAttempts && possibleOperations.length > 0 && !validOperationFound) {
        const randomOperationIndex = Math.floor(Math.random() * possibleOperations.length);
        const selectedOperation = possibleOperations[randomOperationIndex];
        const secondNumber = targetRange[Math.floor(Math.random() * targetRange.length)];
        let nextResult = selectedOperation.operate(currentResult, secondNumber);
  
        if (nextResult !== null && Number.isInteger(nextResult) && targetRange.includes(nextResult)) {
          currentResult = nextResult;
          puzzleSteps.push({ number: secondNumber, operation: selectedOperation });
          if (selectedOperation.type === "multiplicative") {
            movedToMultiplicative = true;
          }
          validOperationFound = true;
        } else {
          // Remove the tried operation to avoid getting stuck on the same invalid operation
          possibleOperations.splice(randomOperationIndex, 1);
        }
        attempts++;
      }
  
      if (!validOperationFound) {
        break; // Stop if we can't find a valid next step within the attempts
      }
    }
  
    return {
      steps: puzzleSteps,
      answer: currentResult,
    };
  }

function drawPuzzleBoard (steps) {


    for (const step of steps) { 
        console.log(`Operation: ${step.operation.name}, Number: ${step.number}, Color: ${step.operation.color}`);

        // construct a string for the dartboard section that needs to be targeted by taking the first letter of the operation name and appending a dash, and then appending the number

        const targetSectionString = `#${step.operation.name.charAt(0)}-${step.number}`;
        const targetSectionElem = document.querySelector(targetSectionString);

        // Add a class to the classlist of targetSectionElem that is the string 'active-' and then append the step.operation.color

        const activeClass = `active-${step.operation.color}`;
        targetSectionElem.classList.add(activeClass);
    }


}
  
  // Example usage remains the same
  const newPuzzle = generatePuzzle();

  document.addEventListener('DOMContentLoaded', function() {
    drawPuzzleBoard(newPuzzle.steps);
});

  console.log("Answer:", newPuzzle.answer);