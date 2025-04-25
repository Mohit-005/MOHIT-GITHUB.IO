import React, { useState } from "react";
import { Parser } from "expr-eval";

// Initialize the parser with specific options
const parser = new Parser({
  operators: {
    // These default to true, but are included to be explicit
    add: true,
    concatenate: true,
    conditional: true,
    divide: true,
    factorial: true,
    multiply: true,
    power: true,
    remainder: true,
    subtract: true,

    // Disable logical operators
    logical: false,
    comparison: false,

    // Disable 'in' and assignment operators
    in: false,
    assignment: true,
  },
});

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [memory, setMemory] = useState(0);
  const [lastOperation, setLastOperation] = useState("");
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  // Input digits and decimal
  const handleDigit = (digit) => {
    if (display === "0" || shouldResetDisplay) {
      setDisplay(digit);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + digit);
    }
  };

  // Add decimal point
  const handleDecimal = () => {
    if (shouldResetDisplay) {
      setDisplay("0.");
      setShouldResetDisplay(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // Handle operations (+, -, *, /)
  const handleOperation = (operation) => {
    if (expression === "") {
      // First operation
      setExpression(display + " " + operation);
      setShouldResetDisplay(true);
    } else if (shouldResetDisplay) {
      // Change operation if needed
      setExpression(expression.slice(0, -1) + operation);
    } else {
      // Calculate result of previous operation
      try {
        const result = evaluateExpression(expression + " " + display);
        setDisplay(result.toString());
        setExpression(result + " " + operation);
        setShouldResetDisplay(true);
      } catch (error) {
        setDisplay("Error");
        setExpression("");
        setShouldResetDisplay(true);
      }
    }
    setLastOperation(operation);
  };

  // Evaluate the expression
  const evaluateExpression = (expr) => {
    try {
      // Replace × with * and ÷ with / for the parser
      const parsableExpr = expr
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/\s/g, "");
      return parser.evaluate(parsableExpr);
    } catch (error) {
      console.error("Evaluation error:", error);
      throw error;
    }
  };

  // Calculate equals
  const handleEquals = () => {
    if (expression === "" || shouldResetDisplay) {
      return;
    }

    try {
      const result = evaluateExpression(expression + " " + display);
      setDisplay(result.toString());
      setExpression("");
      setShouldResetDisplay(true);
    } catch (error) {
      setDisplay("Error");
      setExpression("");
      setShouldResetDisplay(true);
    }
  };

  // Clear display
  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setShouldResetDisplay(false);
  };

  // Toggle positive/negative
  const handleToggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  // Calculate percentage
  const handlePercentage = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  // Memory operations
  const handleMemoryOperation = (op) => {
    switch (op) {
      case "MC": // Memory Clear
        setMemory(0);
        break;
      case "MR": // Memory Recall
        setDisplay(memory.toString());
        setShouldResetDisplay(true);
        break;
      case "M+": // Memory Add
        setMemory(memory + parseFloat(display));
        setShouldResetDisplay(true);
        break;
      case "M-": // Memory Subtract
        setMemory(memory - parseFloat(display));
        setShouldResetDisplay(true);
        break;
      default:
        break;
    }
  };

  // Square root function
  const handleSquareRoot = () => {
    if (parseFloat(display) >= 0) {
      setDisplay(Math.sqrt(parseFloat(display)).toString());
    } else {
      setDisplay("Error");
    }
    setShouldResetDisplay(true);
  };

  // Backspace function
  const handleBackspace = () => {
    if (display === "0" || display === "Error" || display.length === 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Calculator button component
  const CalcButton = ({ label, onClick, className = "" }) => (
    <button
      className={`w-full p-3 text-white font-bold rounded ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full w-full bg-gray-800 flex flex-col">
      {/* Calculator display */}
      <div className="p-2 mb-2 bg-gray-900 text-right">
        <div className="text-gray-500 text-xs h-4">{expression}</div>
        <div className="text-white text-2xl font-bold truncate">{display}</div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-1 p-2">
        {/* Row 1 - Memory and Clear Operations */}
        <CalcButton
          label="MC"
          onClick={() => handleMemoryOperation("MC")}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="MR"
          onClick={() => handleMemoryOperation("MR")}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="M+"
          onClick={() => handleMemoryOperation("M+")}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="M-"
          onClick={() => handleMemoryOperation("M-")}
          className="bg-gray-700 hover:bg-gray-600"
        />

        {/* Row 2 - Clear, Sign, Percentage, Division */}
        <CalcButton
          label="C"
          onClick={handleClear}
          className="bg-red-700 hover:bg-red-600"
        />
        <CalcButton
          label="±"
          onClick={handleToggleSign}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="%"
          onClick={handlePercentage}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="÷"
          onClick={() => handleOperation("/")}
          className="bg-orange-600 hover:bg-orange-500"
        />

        {/* Row 3 - 7, 8, 9, Multiplication */}
        <CalcButton
          label="7"
          onClick={() => handleDigit("7")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="8"
          onClick={() => handleDigit("8")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="9"
          onClick={() => handleDigit("9")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="×"
          onClick={() => handleOperation("*")}
          className="bg-orange-600 hover:bg-orange-500"
        />

        {/* Row 4 - 4, 5, 6, Subtraction */}
        <CalcButton
          label="4"
          onClick={() => handleDigit("4")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="5"
          onClick={() => handleDigit("5")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="6"
          onClick={() => handleDigit("6")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="-"
          onClick={() => handleOperation("-")}
          className="bg-orange-600 hover:bg-orange-500"
        />

        {/* Row 5 - 1, 2, 3, Addition */}
        <CalcButton
          label="1"
          onClick={() => handleDigit("1")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="2"
          onClick={() => handleDigit("2")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="3"
          onClick={() => handleDigit("3")}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="+"
          onClick={() => handleOperation("+")}
          className="bg-orange-600 hover:bg-orange-500"
        />

        {/* Row 6 - 0, Decimal, Backspace, Equals */}
        <CalcButton
          label="0"
          onClick={() => handleDigit("0")}
          className="bg-gray-600 hover:bg-gray-500 col-span-1"
        />
        <CalcButton
          label="."
          onClick={handleDecimal}
          className="bg-gray-600 hover:bg-gray-500"
        />
        <CalcButton
          label="⌫"
          onClick={handleBackspace}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="="
          onClick={handleEquals}
          className="bg-orange-600 hover:bg-orange-500"
        />

        {/* Row 7 - Scientific operations */}
        <CalcButton
          label="√"
          onClick={handleSquareRoot}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="x²"
          onClick={() => {
            setDisplay((parseFloat(display) ** 2).toString());
            setShouldResetDisplay(true);
          }}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="1/x"
          onClick={() => {
            if (parseFloat(display) !== 0) {
              setDisplay((1 / parseFloat(display)).toString());
            } else {
              setDisplay("Error");
            }
            setShouldResetDisplay(true);
          }}
          className="bg-gray-700 hover:bg-gray-600"
        />
        <CalcButton
          label="π"
          onClick={() => {
            setDisplay(Math.PI.toString());
            setShouldResetDisplay(true);
          }}
          className="bg-gray-700 hover:bg-gray-600"
        />
      </div>
    </div>
  );
};

export default Calculator;

export const displayTerminalCalc = () => {
  return <Calculator />;
};
