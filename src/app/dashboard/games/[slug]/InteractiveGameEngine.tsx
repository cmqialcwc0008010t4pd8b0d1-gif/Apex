"use client";

import { useState } from "react";
import Link from "next/link";
import { submitGameAttempt } from "@/app/actions/course";
import { formatDateTime } from "@/lib/utils";
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Award,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

export default function InteractiveGameEngine({
  game,
  pastAttempts,
}: {
  game: any;
  pastAttempts: any[];
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answersRecord, setAnswersRecord] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  const questions = game.questions || [];
  const currentQuestion = questions[currentIdx];
  const maxScore = questions.length;

  // Parse options safely
  let options: string[] = [];
  try {
    options = currentQuestion ? JSON.parse(currentQuestion.optionsJson) : [];
  } catch {
    options = [];
  }

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswersRecord((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswer: option,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      },
    ]);
  };

  const handleNext = async () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Completed all questions
      setIsFinished(true);
      setSaving(true);
      await submitGameAttempt(
        game.id,
        score,
        maxScore,
        JSON.stringify(answersRecord)
      );
      setSaving(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setAnswersRecord([]);
    setIsFinished(false);
  };

  const percentScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const isPassed = percentScore >= 70;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href={game.course ? `/dashboard/courses/${game.course.slug}` : "/dashboard/courses"}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Syllabus</span>
        </Link>

        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
          {game.type}
        </span>
      </div>

      {/* Main Game Interface Card */}
      {!isFinished ? (
        <div className="finance-card p-6 md:p-8 space-y-6">
          {/* Progress and Score Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>Current Score: <strong className="text-teal-400">{score}</strong> / {maxScore}</span>
          </div>

          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xl font-bold text-white leading-snug">
              {currentQuestion?.questionText}
            </h3>
            <p className="text-xs text-slate-400">
              Select the most institutionally accurate answer below:
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectAnswer = opt === currentQuestion.correctAnswer;

              let btnStyle = "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200";

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-semibold";
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = "bg-rose-950/70 border-rose-500 text-rose-200 font-semibold";
                } else {
                  btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start justify-between gap-3 ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && (
                    <span className="shrink-0 mt-0.5">
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Educational Post-Answer Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                <HelpCircle className="w-4 h-4 text-teal-400" />
                <span>Institutional Analysis & Explanation:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.explanation}
              </p>
            </div>
          )}

          {/* Next / Complete Button */}
          {isAnswered && (
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-teal-600/20"
              >
                <span>{currentIdx + 1 === questions.length ? "Finish & Calculate Results" : "Next Scenario"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results & Completion Summary Screen */
        <div className="finance-card p-8 text-center space-y-6">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
              isPassed
                ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                : "bg-amber-950 border border-amber-800 text-amber-400"
            }`}
          >
            {isPassed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-8 h-8" />}
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white">
              {isPassed ? "Challenge Mastered!" : "Review Required"}
            </h3>
            <p className="text-xs text-slate-400">
              {isPassed
                ? "Excellent institutional execution. Your score has been verified and permanently recorded."
                : "A minimum score of 70% is recommended before live market analysis. Review the articles and re-attempt."}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-xs mx-auto">
            <div className="text-3xl font-extrabold text-white">{percentScore}%</div>
            <div className="text-xs text-slate-400 mt-1">
              {score} of {maxScore} Scenarios Correct
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Challenge</span>
            </button>
            <Link
              href="/dashboard/courses"
              className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Return to Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Past Performance History */}
      {pastAttempts.length > 0 && (
        <div className="finance-card p-6 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-white">Your Past Performance History</h4>
            <p className="text-[11px] text-slate-400">Audited attempts on this challenge.</p>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {pastAttempts.map((att, i) => (
              <div key={att.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Attempt #{pastAttempts.length - i}</div>
                  <div className="text-[10px] text-slate-400">{formatDateTime(att.completedAt)}</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">{att.score} / {att.maxScore}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      att.passed
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-rose-950 text-rose-400 border border-rose-800"
                    }`}
                  >
                    {att.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
