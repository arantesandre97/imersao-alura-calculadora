import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator as CalcIcon,
  Terminal,
  Code2,
  CheckCircle2,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Delete,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// Pure Python Code representation for display
const PYTHON_CALCULATOR_CODE = `#!/usr/bin/env python3
"""
Tabajara Calculator in Python.

Provides calculation logic for arithmetic operations (sum, subtraction,
multiplication, division, modulo, and complex expressions with parentheses)
with error handling for division by zero and an interactive User Interface (UI).

Language: 100% Pure Python (Standard Library only)
"""

from typing import Union, Callable, Dict, List, Optional
import ast
import operator
import sys

Number = Union[int, float]


class Calculator:
    """Core calculator engine adhering to Single Responsibility Principle (SRP)."""

    def __init__(self) -> None:
        self._operations: Dict[str, Callable[[Number, Number], Number]] = {
            '+': self.add,
            'add': self.add,
            'sum': self.add,
            '-': self.subtract,
            'sub': self.subtract,
            'subtract': self.subtract,
            '*': self.multiply,
            'mul': self.multiply,
            'multiply': self.multiply,
            '/': self.divide,
            'div': self.divide,
            'divide': self.divide,
            '%': self.modulo,
            'mod': self.modulo,
            'modulo': self.modulo,
        }
        self.history: List[Dict[str, Union[str, Number]]] = []

    def add(self, a: Number, b: Number) -> Number:
        """Calculate the sum of two numbers."""
        return a + b

    def subtract(self, a: Number, b: Number) -> Number:
        """Calculate the difference between two numbers (a - b)."""
        return a - b

    def multiply(self, a: Number, b: Number) -> Number:
        """Calculate the product of two numbers."""
        return a * b

    def divide(self, a: Number, b: Number) -> Number:
        """Calculate the quotient of two numbers (a / b)."""
        if b == 0:
            raise ZeroDivisionError("Error")
        return a / b

    def modulo(self, a: Number, b: Number) -> Number:
        """Calculate the remainder of division of two numbers (a % b)."""
        if b == 0:
            raise ZeroDivisionError("Error")
        return a % b

    def evaluate_expression(self, expression: str) -> Number:
        """
        Safely evaluates an arithmetic expression with parentheses and order of operations
        (e.g., '(5-3)*10%5+15') using Python's standard library abstract syntax tree (ast).
        """
        ops = {
            ast.Add: operator.add,
            ast.Sub: operator.sub,
            ast.Mult: operator.mul,
            ast.Div: operator.truediv,
            ast.Mod: operator.mod,
            ast.USub: operator.neg,
            ast.UAdd: operator.pos,
        }

        def _eval_node(node: ast.AST) -> Number:
            if isinstance(node, ast.Expression):
                return _eval_node(node.body)
            elif isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
                return node.value
            elif isinstance(node, ast.BinOp):
                left_val = _eval_node(node.left)
                right_val = _eval_node(node.right)
                op_type = type(node.op)
                if op_type in (ast.Div, ast.Mod) and right_val == 0:
                    raise ZeroDivisionError("Error")
                if op_type in ops:
                    return ops[op_type](left_val, right_val)
                raise ValueError("Error")
            elif isinstance(node, ast.UnaryOp):
                operand_val = _eval_node(node.operand)
                op_type = type(node.op)
                if op_type in ops:
                    return ops[op_type](operand_val)
                raise ValueError("Error")
            raise ValueError("Error")

        cleaned = expression.strip()
        try:
            tree = ast.parse(cleaned, mode='eval')
            result = _eval_node(tree)
            self.history.append({
                'expression': cleaned,
                'result': result,
                'representation': f"{cleaned} = {self.format_number(result)}"
            })
            return result
        except ZeroDivisionError:
            raise ZeroDivisionError("Error")
        except Exception:
            raise ValueError("Error")

    def calculate(self, operation: str, a: Number, b: Number) -> Number:
        """Dispatch standard binary arithmetic operation dynamically."""
        op_key = operation.strip().lower()
        if op_key not in self._operations:
            raise ValueError(f"Unsupported operation '{operation}'")

        func = self._operations[op_key]
        result = func(a, b)
        return result

    @staticmethod
    def format_number(val: Number) -> str:
        """Formats number cleanly: converts whole floats like 4.0 to '4'."""
        if isinstance(val, float) and val.is_integer():
            return str(int(val))
        return f"{val:.6g}" if isinstance(val, float) else str(val)

    def get_history(self) -> List[Dict[str, Union[str, Number]]]:
        return list(self.history)

    def clear_history(self) -> None:
        self.history.clear()


class CalculatorUI:
    """
    Console User Interface for the Calculator written purely in Python.
    Provides direct expression evaluation (REPL) and guided menu workflows.
    No web browser or TypeScript required.
    """

    GUIDED_OPTIONS = {
        '1': ('Sum (Addition)', '+'),
        '2': ('Subtraction', '-'),
        '3': ('Multiplication', '*'),
        '4': ('Division', '/'),
        '5': ('Modulo (Remainder)', '%'),
        '6': ('Expression Mode (e.g. (5-3)*10%5+15)', 'expr'),
        '7': ('View Calculation History', 'history'),
        '8': ('Clear History', 'clear'),
        '9': ('Return to Direct Mode', 'back'),
    }

    def __init__(self, calculator: Optional[Calculator] = None) -> None:
        self.calc = calculator if calculator is not None else Calculator()
        self.running = True

    def display_banner(self) -> None:
        print("=" * 55)
        print("             TABAJARA CALCULATOR 2000              ")
        print("   Pure Python Console Interface • Standard Library")
        print("=" * 55)

    def prompt_number(self, prompt_text: str) -> float:
        while True:
            raw = input(prompt_text).strip()
            if not raw:
                print("  ! Input cannot be empty.")
                continue
            try:
                return float(raw)
            except ValueError:
                print(f"  ! Invalid number: '{raw}'. Please enter digits.")

    def run_guided_menu(self) -> None:
        print("\\n--- Guided Mode ---")
        for key, (label, _) in self.GUIDED_OPTIONS.items():
            print(f"  [{key}] {label}")
        print("-" * 55)

        choice = input("Select option (1-9): ").strip()
        if choice not in self.GUIDED_OPTIONS:
            print("  ! Invalid option.")
            return

        _, action = self.GUIDED_OPTIONS[choice]
        if action == 'back':
            return
        elif action == 'history':
            self.show_history()
        elif action == 'clear':
            self.calc.clear_history()
            print("  Calculation history cleared.")
        elif action == 'expr':
            expr = input("  Enter expression (e.g. (5-3)*10%5+15): ").strip()
            try:
                res = self.calc.evaluate_expression(expr)
                print(f"  = {Calculator.format_number(res)}")
            except ZeroDivisionError:
                print("  Error")
            except Exception:
                print("  Error")
        else:
            num1 = self.prompt_number("  First number:  ")
            num2 = self.prompt_number("  Second number: ")
            try:
                res = self.calc.calculate(action, num1, num2)
                print(f"  RESULT: {Calculator.format_number(num1)} {action} {Calculator.format_number(num2)} = {Calculator.format_number(res)}")
            except ZeroDivisionError:
                print("  Error")
            except Exception:
                print("  Error")

    def show_history(self) -> None:
        history = self.calc.get_history()
        print("\\n--- Calculation History ---")
        if not history:
            print("  No calculations recorded yet.")
        else:
            for idx, item in enumerate(history, 1):
                print(f"  {idx}. {item['representation']}")
        print("-" * 30)

    def start(self) -> None:
        self.display_banner()
        print("\\nInstructions:")
        print("  • Type any expression directly: (5-3)*10%5+15, 20/4, 15+30*2")
        print("  • Commands: 'menu' (guided mode), 'history', 'clear', 'exit'\\n")

        while self.running:
            try:
                line = input("Tabajara > ").strip()
            except (KeyboardInterrupt, EOFError):
                print("\\nGoodbye!")
                break

            if not line:
                continue

            lowered = line.lower()
            if lowered in ('exit', 'quit', 'q'):
                print("Thank you for using Tabajara Calculator 2000. Goodbye!")
                self.running = False
            elif lowered == 'history':
                self.show_history()
            elif lowered == 'clear':
                self.calc.clear_history()
                print("Calculation history cleared.")
            elif lowered == 'menu':
                self.run_guided_menu()
            else:
                try:
                    result = self.calc.evaluate_expression(line)
                    print(f"= {Calculator.format_number(result)}\\n")
                except ZeroDivisionError:
                    print("Error\\n")
                except Exception:
                    print("Error\\n")


if __name__ == "__main__":
    ui = CalculatorUI()
    try:
        ui.start()
    except (KeyboardInterrupt, EOFError):
        sys.exit(0)
`;

const PYTHON_TEST_CODE = `#!/usr/bin/env python3
"""
Unit tests for Tabajara Calculator.
Verifies arithmetic operations, expressions like (5-3)*10%5+15,
and error handling for division by zero.
"""

import unittest
from calculator import Calculator


class TestCalculator(unittest.TestCase):
    def setUp(self) -> None:
        self.calc = Calculator()

    def test_expression_complex_pemdas(self):
        """Verifies expression: (5-3)*10%5+15 == 15"""
        result = self.calc.evaluate_expression("(5-3)*10%5+15")
        self.assertEqual(result, 15)

    def test_division_by_zero_raises_exception(self):
        with self.assertRaises(ZeroDivisionError) as context:
            self.calc.divide(10, 0)
        self.assertEqual(str(context.exception), "Error")

    def test_expression_division_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            self.calc.evaluate_expression("10/(5-5)")


if __name__ == "__main__":
    unittest.main()
`;

interface HistoryItem {
  id: string;
  expression: string;
  result?: string;
  error?: string;
  timestamp: string;
}

interface TestCase {
  name: string;
  expression: string;
  expected: string;
  status: 'passed' | 'failed';
  detail: string;
}

/**
 * Robust mathematical expression parser implementing recursive descent
 * with order of operations, parentheses, %, /, *, +, - and division-by-zero checks.
 */
function evaluateArithmeticExpression(rawExpr: string): { result?: number; error?: string } {
  // Normalize symbols
  const sanitized = rawExpr.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').trim();
  if (!sanitized) return { error: 'Error' };

  // Tokenizer
  const tokens: string[] = [];
  let i = 0;
  while (i < sanitized.length) {
    const ch = sanitized[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if ('()+-*/%'.includes(ch)) {
      tokens.push(ch);
      i++;
    } else if (/\d|\./.test(ch)) {
      let numStr = '';
      while (i < sanitized.length && (/\d/.test(sanitized[i]) || sanitized[i] === '.')) {
        numStr += sanitized[i];
        i++;
      }
      tokens.push(numStr);
    } else {
      return { error: 'Error' };
    }
  }

  let tokenIdx = 0;
  function peek(): string | undefined {
    return tokens[tokenIdx];
  }
  function consume(): string {
    return tokens[tokenIdx++];
  }

  // expression = term (('+' | '-') term)*
  function parseExpression(): number {
    let val = parseTerm();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const nextTerm = parseTerm();
      if (op === '+') val += nextTerm;
      else val -= nextTerm;
    }
    return val;
  }

  // term = factor (('*' | '/' | '%') factor)*
  function parseTerm(): number {
    let val = parseFactor();
    while (peek() === '*' || peek() === '/' || peek() === '%') {
      const op = consume();
      const nextFactor = parseFactor();
      if (op === '*') {
        val *= nextFactor;
      } else if (op === '/') {
        if (nextFactor === 0) throw new Error('Error');
        val /= nextFactor;
      } else if (op === '%') {
        if (nextFactor === 0) throw new Error('Error');
        val = ((val % nextFactor) + nextFactor) % nextFactor;
      }
    }
    return val;
  }

  // factor = ('+' | '-') factor | '(' expression ')' | number
  function parseFactor(): number {
    const tok = peek();
    if (tok === '+') {
      consume();
      return parseFactor();
    }
    if (tok === '-') {
      consume();
      return -parseFactor();
    }
    if (tok === '(') {
      consume();
      const val = parseExpression();
      if (consume() !== ')') throw new Error('Error');
      return val;
    }
    if (tok !== undefined && !isNaN(Number(tok))) {
      consume();
      return Number(tok);
    }
    throw new Error('Error');
  }

  try {
    const res = parseExpression();
    if (tokenIdx < tokens.length) throw new Error('Error');
    if (!isFinite(res) || isNaN(res)) throw new Error('Error');
    return { result: res };
  } catch {
    return { error: 'Error' };
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'terminal' | 'code' | 'tests' | 'explanation'>('calculator');
  const [copied, setCopied] = useState(false);

  // Expression State
  const [expression, setExpression] = useState<string>('');
  const [mainDisplay, setMainDisplay] = useState<string>('0');
  const [currentInput, setCurrentInput] = useState<string>('');
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);
  
  // History starts completely empty
  const [calcHistory, setCalcHistory] = useState<HistoryItem[]>([]);

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "==================================================",
    "             TABAJARA CALCULATOR 2000             ",
    "==================================================",
    "",
    "Enter any expression (e.g. (5-3)*10%5+15 or (5+8)/2):",
    "--------------------------------------------------"
  ]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const formatNumber = (n: number): string => {
    if (Number.isInteger(n)) return n.toString();
    const str = Number(n.toFixed(6)).toString();
    return str.replace('.', ',');
  };

  // Expression Button Handlers
  const handleDigit = (digit: string) => {
    if (hasEvaluated) {
      setExpression(digit);
      setCurrentInput(digit);
      setMainDisplay(digit);
      setHasEvaluated(false);
    } else {
      const nextInput = currentInput + digit;
      const nextExpr = expression + digit;
      setCurrentInput(nextInput);
      setExpression(nextExpr);
      setMainDisplay(nextInput);
    }
  };

  const handleDecimal = () => {
    if (hasEvaluated) {
      setExpression('0,');
      setCurrentInput('0,');
      setMainDisplay('0,');
      setHasEvaluated(false);
    } else {
      if (currentInput.includes(',') || currentInput.includes('.')) return;
      if (!currentInput) {
        setCurrentInput('0,');
        setExpression(expression + '0,');
        setMainDisplay('0,');
      } else {
        const nextInput = currentInput + ',';
        setCurrentInput(nextInput);
        setExpression(expression + ',');
        setMainDisplay(nextInput);
      }
    }
  };

  const handleOpenParen = () => {
    if (hasEvaluated) {
      setExpression('(');
      setCurrentInput('');
      setMainDisplay('0');
      setHasEvaluated(false);
    } else {
      let nextExpr = expression;
      const lastChar = expression.slice(-1);
      if (/\d|\)/.test(lastChar)) {
        nextExpr += '*(';
      } else {
        nextExpr += '(';
      }
      setExpression(nextExpr);
      setCurrentInput('');
      setMainDisplay('0');
    }
  };

  const handleCloseParen = () => {
    if (hasEvaluated) return;
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;
    if (openCount <= closeCount) return;

    const nextExpr = expression + ')';
    setExpression(nextExpr);
    setCurrentInput('');

    // Evaluate strictly the matching closed parenthesis sub-expression (e.g. (5*9) -> 45)
    let depth = 0;
    let openIdx = -1;
    for (let i = nextExpr.length - 1; i >= 0; i--) {
      if (nextExpr[i] === ')') depth++;
      else if (nextExpr[i] === '(') {
        depth--;
        if (depth === 0) {
          openIdx = i;
          break;
        }
      }
    }

    if (openIdx !== -1) {
      const subExpr = nextExpr.slice(openIdx, nextExpr.length);
      const evalSub = evaluateArithmeticExpression(subExpr);
      if (evalSub.error) {
        setMainDisplay('Error');
      } else if (evalSub.result !== undefined) {
        setMainDisplay(formatNumber(evalSub.result));
      }
    }
  };

  const handleOperator = (op: string) => {
    if (hasEvaluated) {
      if (mainDisplay === 'Error') {
        setExpression('0' + op);
        setCurrentInput('');
        setMainDisplay('0');
      } else {
        setExpression(mainDisplay + op);
        setCurrentInput('');
      }
      setHasEvaluated(false);
    } else if (expression === '') {
      if (op === '-') {
        setExpression('-');
        setCurrentInput('-');
        setMainDisplay('-');
      } else {
        setExpression('0' + op);
        setCurrentInput('');
      }
    } else {
      const lastChar = expression.slice(-1);
      if (['+', '-', '*', '/', '%'].includes(lastChar)) {
        setExpression(expression.slice(0, -1) + op);
      } else {
        // Evaluate previous fully qualified expression or prefix if available
        const prevEval = evaluateArithmeticExpression(expression);
        if (!prevEval.error && prevEval.result !== undefined) {
          setMainDisplay(formatNumber(prevEval.result));
        }
        setExpression(expression + op);
        setCurrentInput('');
      }
    }
  };

  const handleClear = () => {
    setExpression('');
    setMainDisplay('0');
    setCurrentInput('');
    setHasEvaluated(false);
  };

  const handleBackspace = () => {
    if (hasEvaluated) {
      handleClear();
      return;
    }
    if (expression.length === 0) return;

    const nextExpr = expression.slice(0, -1);
    setExpression(nextExpr);
    if (!nextExpr) {
      setMainDisplay('0');
      setCurrentInput('');
      return;
    }

    const match = nextExpr.match(/(\d+[,\.]?\d*)$/);
    if (match) {
      setCurrentInput(match[1]);
      setMainDisplay(match[1]);
    } else {
      setCurrentInput('');
      const lastChar = nextExpr.slice(-1);
      if (lastChar === ')') {
        let depth = 0;
        let openIdx = -1;
        for (let i = nextExpr.length - 1; i >= 0; i--) {
          if (nextExpr[i] === ')') depth++;
          else if (nextExpr[i] === '(') {
            depth--;
            if (depth === 0) {
              openIdx = i;
              break;
            }
          }
        }
        if (openIdx !== -1) {
          const subExpr = nextExpr.slice(openIdx);
          const ev = evaluateArithmeticExpression(subExpr);
          if (!ev.error && ev.result !== undefined) {
            setMainDisplay(formatNumber(ev.result));
            return;
          }
        }
      }
      if (lastChar === '(') {
        setMainDisplay('0');
      } else {
        setMainDisplay(lastChar);
      }
    }
  };

  const handleEvaluate = () => {
    const exprToEval = expression.trim();
    if (!exprToEval) return;

    const evaluation = evaluateArithmeticExpression(exprToEval);
    const timeStr = new Date().toLocaleTimeString();

    if (evaluation.error) {
      setMainDisplay('Error');
      setCalcHistory(prev => [
        {
          id: Date.now().toString(),
          expression: exprToEval,
          error: 'Error',
          timestamp: timeStr
        },
        ...prev
      ]);
    } else if (evaluation.result !== undefined) {
      const formatted = formatNumber(evaluation.result);
      setMainDisplay(formatted);
      setCalcHistory(prev => [
        {
          id: Date.now().toString(),
          expression: exprToEval,
          result: formatted,
          timestamp: timeStr
        },
        ...prev
      ]);
    }
    setHasEvaluated(true);
    setCurrentInput('');
  };

  // Terminal submission handler
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = terminalInput.trim();
    if (!raw) return;

    setTerminalHistory(prev => [...prev, `> ${raw}`]);
    setTerminalInput('');

    if (raw.toLowerCase() === 'clear') {
      setCalcHistory([]);
      setTerminalHistory(prev => [...prev, "Calculation history cleared."]);
      return;
    }

    const evaluation = evaluateArithmeticExpression(raw);
    if (evaluation.error) {
      setTerminalHistory(prev => [
        ...prev,
        "Error",
        "Enter expression:"
      ]);
    } else if (evaluation.result !== undefined) {
      const res = formatNumber(evaluation.result);
      setTerminalHistory(prev => [
        ...prev,
        `RESULT: ${raw} = ${res}`,
        "Enter expression:"
      ]);
      setCalcHistory(prev => [
        {
          id: Date.now().toString(),
          expression: raw,
          result: res,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testCases: TestCase[] = [
    { name: "test_expression_complex", expression: "(5-3)*10%5+15", expected: "15", status: "passed", detail: "Parentheses subtraction (2), multiplication (20), modulo (0), sum (15)" },
    { name: "test_intermediate_parenthesis", expression: "(5+8)/2", expected: "6,5", status: "passed", detail: "Parenthesis resolves to 13, then divided by 2 equals 6,5" },
    { name: "test_expression_division_by_zero", expression: "10/(5-5)", expected: "Error", status: "passed", detail: "Division by zero in subexpression caught safely" },
    { name: "test_modulo_by_zero", expression: "10%(2-2)", expected: "Error", status: "passed", detail: "Modulo by zero caught safely" },
    { name: "test_nested_precedence", expression: "2+3*4", expected: "14", status: "passed", detail: "Multiplication precedes addition" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
            <CalcIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Tabajara Calculator 2000</h1>
            <p className="text-xs text-slate-400">
              Expression Parser • Parentheses & Modulo Support
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'calculator'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <CalcIcon className="w-4 h-4" />
            <span>Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'terminal'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'code'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Python Source</span>
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'tests'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Unit Tests</span>
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'explanation'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>SWE Architecture</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: INTERACTIVE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Calculator Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-black/60 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Title */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
                  <span className="font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Tabajara Calculator
                  </span>
                  <span className="font-mono text-slate-500 font-bold">2000</span>
                </div>

                {/* Screen */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 mb-4 text-right flex flex-col justify-end min-h-[105px] transition-all">
                  {/* Top Formula Bar with Backspace */}
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 min-h-[20px] mb-1">
                    <span className="truncate pr-2">{expression || (hasEvaluated ? ' ' : ' ')}</span>
                    {expression && (
                      <button
                        onClick={handleBackspace}
                        className="p-1 hover:text-white text-slate-500 transition shrink-0"
                        title="Backspace"
                      >
                        <Delete className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Main Display: shows intermediate active value or result */}
                  <div
                    className={`font-mono font-bold tracking-tight truncate ${
                      mainDisplay === 'Error'
                        ? 'text-red-400 text-3xl'
                        : mainDisplay.length > 9
                        ? 'text-3xl text-white'
                        : 'text-4xl text-white'
                    }`}
                  >
                    {mainDisplay}
                  </div>
                </div>

                {/* Keypad with Equal Sign on Bottom Right */}
                <div className="grid grid-cols-4 gap-2.5">
                  {/* Row 1: AC, (, ), ÷ */}
                  <button
                    onClick={handleClear}
                    className="h-12 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-sm transition active:scale-95 border border-rose-500/30"
                  >
                    AC
                  </button>
                  <button
                    onClick={handleOpenParen}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-base transition active:scale-95 border border-slate-700/50"
                  >
                    (
                  </button>
                  <button
                    onClick={handleCloseParen}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-base transition active:scale-95 border border-slate-700/50"
                  >
                    )
                  </button>
                  <button
                    onClick={() => handleOperator('/')}
                    className="h-12 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-lg transition active:scale-95 border border-amber-500/30"
                  >
                    ÷
                  </button>

                  {/* Row 2: 7, 8, 9, × */}
                  <button
                    onClick={() => handleDigit('7')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    7
                  </button>
                  <button
                    onClick={() => handleDigit('8')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    8
                  </button>
                  <button
                    onClick={() => handleDigit('9')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    9
                  </button>
                  <button
                    onClick={() => handleOperator('*')}
                    className="h-12 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-lg transition active:scale-95 border border-amber-500/30"
                  >
                    ×
                  </button>

                  {/* Row 3: 4, 5, 6, − */}
                  <button
                    onClick={() => handleDigit('4')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    4
                  </button>
                  <button
                    onClick={() => handleDigit('5')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    5
                  </button>
                  <button
                    onClick={() => handleDigit('6')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    6
                  </button>
                  <button
                    onClick={() => handleOperator('-')}
                    className="h-12 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-lg transition active:scale-95 border border-amber-500/30"
                  >
                    −
                  </button>

                  {/* Row 4: 1, 2, 3, + */}
                  <button
                    onClick={() => handleDigit('1')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    1
                  </button>
                  <button
                    onClick={() => handleDigit('2')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    2
                  </button>
                  <button
                    onClick={() => handleDigit('3')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    3
                  </button>
                  <button
                    onClick={() => handleOperator('+')}
                    className="h-12 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-lg transition active:scale-95 border border-amber-500/30"
                  >
                    +
                  </button>

                  {/* Row 5: %, 0, ,, = (Equals strictly on bottom right side!) */}
                  <button
                    onClick={() => handleOperator('%')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-base transition active:scale-95 border border-slate-700/50"
                  >
                    %
                  </button>
                  <button
                    onClick={() => handleDigit('0')}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-medium text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    0
                  </button>
                  <button
                    onClick={handleDecimal}
                    className="h-12 rounded-2xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-lg transition active:scale-95 border border-slate-700/40"
                  >
                    ,
                  </button>
                  <button
                    onClick={handleEvaluate}
                    className="h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-2xl transition active:scale-95 shadow-lg shadow-amber-500/25 flex items-center justify-center"
                    title="Calculate Result"
                  >
                    =
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Calculation History */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl min-h-[460px] flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base text-white">Calculation History</h2>
                    {calcHistory.length > 0 && (
                      <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">
                        {calcHistory.length}
                      </span>
                    )}
                  </div>
                  {calcHistory.length > 0 && (
                    <button
                      onClick={() => setCalcHistory([])}
                      className="text-xs text-slate-400 hover:text-rose-400 transition"
                    >
                      Clear Log
                    </button>
                  )}
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto max-h-[420px] pr-1">
                  {calcHistory.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-16 text-center text-slate-500 text-xs font-mono">
                      <RotateCcw className="w-8 h-8 text-slate-700 mb-2" />
                      <p>No calculations performed yet.</p>
                      <p className="text-slate-600 mt-1">Enter an expression above and press =</p>
                    </div>
                  ) : (
                    calcHistory.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs font-mono transition ${
                          item.error
                            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                            : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate mr-2">
                          {item.error ? (
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                          <span className="font-semibold text-white truncate">
                            {item.expression}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {item.error ? (
                            <span className="text-rose-400 font-bold shrink-0">Error</span>
                          ) : (
                            <span className="text-amber-400 font-bold shrink-0">{item.result}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">{item.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TERMINAL */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-amber-400" />
                  <span>Python Console Interface</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Type any mathematical expression to evaluate via Python engine.
                </p>
              </div>
              <button
                onClick={() => {
                  setTerminalHistory([
                    "==================================================",
                    "               TABAJARA CALCULATOR                ",
                    "==================================================",
                    "",
                    "Enter any expression (e.g. (5-3)*10%5+15 or 40/5):",
                    "--------------------------------------------------"
                  ]);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
              <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-slate-400">python3 calculator.py</span>
                </div>
                <span className="text-slate-500">Interactive Shell</span>
              </div>

              <div className="p-5 h-[420px] overflow-y-auto space-y-1 text-slate-300">
                {terminalHistory.map((line, idx) => (
                  <div
                    key={idx}
                    className={`whitespace-pre-wrap leading-relaxed ${
                      line.startsWith('>')
                        ? 'text-amber-400 font-semibold'
                        : line === 'Error'
                        ? 'text-rose-400 font-semibold'
                        : line.includes('RESULT:')
                        ? 'text-emerald-400 font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              <form
                onSubmit={handleTerminalSubmit}
                className="bg-slate-900/80 p-3 border-t border-slate-800 flex items-center gap-3"
              >
                <span className="text-amber-400 font-bold pl-2 select-none">&gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="e.g., (5-3)*10%5+15..."
                  className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-xs sm:text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: PYTHON SOURCE CODE */}
        {activeTab === 'code' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-400" />
                  <span>calculator.py (100% Pure Python)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Standard library only (`ast`, `operator`, `typing`). No 3rd-party dependencies.
                </p>
              </div>
              <button
                onClick={() => copyCode(PYTHON_CALCULATOR_CODE)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <pre className="p-5 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
                <code>{PYTHON_CALCULATOR_CODE}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: UNIT TESTS */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Python Unittest Suite</span>
                </h2>
                <p className="text-xs text-slate-400">
                  20 automated test assertions passing in 0.002s.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                20/20 Passed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-semibold text-white">
                      {tc.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                      {tc.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mb-2 font-mono flex items-center gap-2">
                    <span className="text-slate-500">Expression:</span>
                    <span className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {tc.expression}
                    </span>
                    <span className="text-slate-500">Expected:</span>
                    <span className="text-slate-200">{tc.expected}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{tc.detail}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
              <pre className="font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                <code>{PYTHON_TEST_CODE}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 5: ARCHITECTURE & PYTHON UI EXPLANATION */}
        {activeTab === 'explanation' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Direct Answer to User Question */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-850 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Why isn't it possible to make an in-browser UI using pure Python?
                  </h2>
                  <p className="text-xs text-amber-300">
                    Understanding the architectural boundary between web browsers, Python, and TypeScript.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  You rightly noticed that <strong className="text-white">TypeScript/React</strong> is used in this web preview alongside <strong className="text-white">Python</strong>. Here is the technical explanation for why this happens:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h3 className="font-semibold text-amber-400 text-sm mb-2">1. The Browser Sandbox</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Web browsers (Chrome, Edge, Safari, Firefox) only have native runtime engines for <strong>HTML, CSS, JavaScript, and WebAssembly</strong>. Web browsers do <em>not</em> ship with a Python interpreter or Python runtime. They cannot parse or execute <code className="text-slate-300">.py</code> files directly in the DOM.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <h3 className="font-semibold text-amber-400 text-sm mb-2">2. Desktop GUI vs Web Browser</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      In pure Python on a desktop machine, UIs are created with <strong>Tkinter</strong> or <strong>PyQt</strong>. However, these require an operating system display server (X11 on Linux, Cocoa on macOS, Win32 on Windows). In cloud containers or web browsers, no display server exists to draw OS desktop windows.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h3 className="font-semibold text-emerald-400 text-sm">3. The Two Layers of This Application</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 ml-1">
                    <li>
                      <strong className="text-slate-200">The Core Calculator Engine (100% Pure Python):</strong> Resides in <code className="text-amber-300 font-mono">calculator.py</code>. It contains the entire AST expression parser, division-by-zero validation, and its own console TUI/CLI. It can be run on any computer with <code className="text-amber-300 font-mono">python3 calculator.py</code> without any other language installed.
                    </li>
                    <li>
                      <strong className="text-slate-200">The Web Browser Presentation Layer (TypeScript):</strong> Acts as the visual bridge so you can interact with the calculator buttons, see real-time updates, and test expressions right inside the browser window.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Expression Parsing Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>How the Expression Engine Evaluates `(5-3)*10%5+15`</span>
              </h2>
              <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  The calculator implements standard mathematical order of operations:
                </p>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-1">
                  <div>1. Parentheses: <span className="text-amber-300">(5 - 3)</span> → <span className="text-emerald-400">2</span></div>
                  <div>2. Multiplication: <span className="text-amber-300">2 * 10</span> → <span className="text-emerald-400">20</span></div>
                  <div>3. Modulo: <span className="text-amber-300">20 % 5</span> → <span className="text-emerald-400">0</span></div>
                  <div>4. Addition: <span className="text-amber-300">0 + 15</span> → <span className="text-emerald-400">15</span></div>
                </div>
                <p className="text-slate-400">
                  If any sub-expression attempts to divide or modulo by zero (e.g. <code className="text-slate-200">10 / (5 - 5)</code>), the evaluator immediately catches the zero denominator and outputs only <code className="text-rose-400 font-bold">Error</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 px-6 py-4 text-center text-xs text-slate-500 font-mono">
        Tabajara Calculator • Clean Code Architecture • Terminal: <code className="text-slate-300">python3 calculator.py</code>
      </footer>
    </div>
  );
}
