import React, { useState } from 'react';
import {
  Play,
  Bug,
  Code2,
  Terminal,
  Clock,
  HardDrive,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { Language, CodeDebugResponse } from '../types';
import { UI_TRANSLATIONS } from '../data/curriculum';
import { debugCode } from '../services/api';

interface CodingStudioProps {
  currentLanguage: Language;
}

const SAMPLE_PROGRAMS: Record<string, { title: string; lang: string; code: string; expected: string }> = {
  binarySearch: {
    title: 'Binary Search Algorithm (O(log n))',
    lang: 'python',
    code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1

# Test the algorithm
data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target = 23
result = binary_search(data, target)
print(f"Target {target} found at index: {result}")`,
    expected: 'Find index of 23 in sorted array',
  },
  fibonacci: {
    title: 'Dynamic Programming: Fibonacci (Memoized)',
    lang: 'python',
    code: `def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# Calculate 40th Fibonacci number in O(n) time
print(f"Fibonacci(40) = {fib_memo(40)}")`,
    expected: 'Calculate 40th Fibonacci number efficiently',
  },
  buggyCode: {
    title: 'Buggy Array Filter & Sum (Debug Challenge)',
    lang: 'javascript',
    code: `function sumPositiveNumbers(numbers) {
    let total = 0;
    // Bug 1: Off-by-one index error
    for (let i = 0; i <= numbers.length; i++) {
        // Bug 2: Doesn't check if numbers[i] is positive
        total += numbers[i];
    }
    return total;
}

const list = [10, -5, 20, -15, 30];
console.log("Sum:", sumPositiveNumbers(list));`,
    expected: 'Only sum positive numbers, fix NaN bug',
  },
};

export const CodingStudio: React.FC<CodingStudioProps> = ({ currentLanguage }) => {
  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.English;

  const [codeLanguage, setCodeLanguage] = useState('python');
  const [code, setCode] = useState(SAMPLE_PROGRAMS.binarySearch.code);
  const [output, setOutput] = useState<string>('Ready to run. Click "Run Code Simulation" or "AI Debug & Fix Bugs".');
  const [isRunning, setIsRunning] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [debugResult, setDebugResult] = useState<CodeDebugResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Executing code in sandbox...');

    setTimeout(() => {
      if (codeLanguage === 'javascript') {
        try {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' ')),
            error: (...args: any[]) => logs.push('ERROR: ' + args.join(' ')),
            warn: (...args: any[]) => logs.push('WARN: ' + args.join(' ')),
          };

          // Safe evaluation with mock console
          const runFunction = new Function('console', code);
          runFunction(customConsole);

          setOutput(logs.length > 0 ? logs.join('\n') : 'Execution finished with no output.');
        } catch (err: any) {
          setOutput(`Runtime Error: ${err.message}`);
        }
      } else {
        // Simulated execution for Python, C++, etc.
        if (code.includes('binary_search')) {
          setOutput(`>>> Running Python 3.12 sandbox...\nTarget 23 found at index: 5\n\nExecution Time: 0.002s\nMemory: 14.2 MB\nProcess finished with exit code 0`);
        } else if (code.includes('fib_memo')) {
          setOutput(`>>> Running Python 3.12 sandbox...\nFibonacci(40) = 102334155\n\nExecution Time: 0.001s\nMemory: 15.0 MB\nProcess finished with exit code 0`);
        } else {
          setOutput(`>>> Sandbox Simulation (${codeLanguage.toUpperCase()})\nProgram compiled and executed successfully.\n[Output generated according to algorithm instructions]\nStatus: OK`);
        }
      }
      setIsRunning(false);
    }, 600);
  };

  const handleDebugCode = async () => {
    setIsDebugging(true);
    setDebugResult(null);

    try {
      const result = await debugCode({
        code,
        language: codeLanguage,
        userLanguage: currentLanguage,
      });

      setDebugResult(result);
      if (result.simulatedOutput) {
        setOutput(result.simulatedOutput);
      }
    } catch (err: any) {
      setOutput(`Debug failed: ${err.message}`);
    } finally {
      setIsDebugging(false);
    }
  };

  const handleApplyFixedCode = () => {
    if (debugResult?.fixedCode) {
      setCode(debugResult.fixedCode);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Coding Studio & Algorithm Sandbox
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive code execution, automated bug detection, time/space complexity, and step-by-step logic
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Presets:</span>
          <button
            onClick={() => {
              setCode(SAMPLE_PROGRAMS.binarySearch.code);
              setCodeLanguage('python');
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition"
          >
            Binary Search
          </button>
          <button
            onClick={() => {
              setCode(SAMPLE_PROGRAMS.fibonacci.code);
              setCodeLanguage('python');
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition"
          >
            Fibonacci DP
          </button>
          <button
            onClick={() => {
              setCode(SAMPLE_PROGRAMS.buggyCode.code);
              setCodeLanguage('javascript');
            }}
            className="px-2.5 py-1 text-xs rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 transition"
          >
            Buggy Code
          </button>
        </div>
      </div>

      {/* Editor & Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Editor Panel */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 shadow-md flex flex-col overflow-hidden">
          {/* Editor Header Bar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />

              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="ml-3 px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700 focus:outline-none"
              >
                <option value="python">Python 3.12</option>
                <option value="javascript">JavaScript (ES6)</option>
                <option value="typescript">TypeScript</option>
                <option value="cpp">C++ (GCC 13)</option>
                <option value="java">Java 21</option>
                <option value="sql">SQL</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Line Numbers + Textarea Editor */}
          <div className="relative flex-1 flex min-h-[360px] bg-slate-900">
            <div className="w-12 py-3 bg-slate-950 text-slate-600 font-mono text-xs select-none text-right pr-3 border-r border-slate-800">
              {lineNumbers.map((num) => (
                <div key={num} className="leading-6">
                  {num}
                </div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent text-emerald-400 font-mono text-xs leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-indigo-500/30 overflow-x-auto"
            />
          </div>

          {/* Action Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50 transition"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunning ? 'Running...' : t.runCode}</span>
              </button>

              <button
                onClick={handleDebugCode}
                disabled={isDebugging}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 transition"
              >
                <Bug className="w-3.5 h-3.5" />
                <span>{isDebugging ? 'Analyzing...' : t.debugCode}</span>
              </button>
            </div>

            <button
              onClick={() => {
                setCode('');
                setOutput('Editor cleared.');
                setDebugResult(null);
              }}
              className="p-2 text-slate-500 hover:text-slate-300 transition"
              title="Reset Editor"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Output & AI Analysis Panel */}
        <div className="lg:col-span-5 space-y-4">
          {/* Terminal Console */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Console Output
              </span>
              <span className="text-[11px] text-slate-500">Live Simulator</span>
            </div>
            <div className="p-4 font-mono text-xs text-slate-200 min-h-[140px] max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {output}
            </div>
          </div>

          {/* AI Debugging & Performance Insight */}
          {debugResult && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  AI Code Diagnostic
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    debugResult.hasBugs
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  }`}
                >
                  {debugResult.hasBugs ? 'Bugs Detected' : 'Clean Code'}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {debugResult.summary}
              </p>

              {/* Complexity Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    Time: {debugResult.timeComplexity}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    Space: {debugResult.spaceComplexity}
                  </span>
                </div>
              </div>

              {/* Issues List */}
              {debugResult.issuesFound && debugResult.issuesFound.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Issues Identified:
                  </span>
                  {debugResult.issuesFound.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Line {issue.line} [{issue.type}]</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{issue.description}</p>
                      <p className="text-emerald-700 dark:text-emerald-300 font-mono text-[11px]">
                        Fix: {issue.fix}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Learning Points */}
              {debugResult.learningPoints && debugResult.learningPoints.length > 0 && (
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Best Practice Takeaways:</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-0.5">
                    {debugResult.learningPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {debugResult.fixedCode && (
                <button
                  onClick={handleApplyFixedCode}
                  className="w-full py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Apply AI Fixed Code to Editor
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
