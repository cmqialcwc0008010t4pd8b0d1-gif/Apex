"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { markArticleCompleted, toggleBookmark } from "@/app/actions/course";
import {
  BookOpen,
  CheckCircle2,
  Bookmark,
  Clock,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  ArrowRight,
  Share2,
  Check,
} from "lucide-react";

export default function ArticleReaderClient({
  course,
  article,
  prevArticle,
  nextArticle,
  initialIsCompleted,
  initialIsBookmarked,
  associatedGame,
}: {
  course: any;
  article: any;
  prevArticle: any;
  nextArticle: any;
  initialIsCompleted: boolean;
  initialIsBookmarked: boolean;
  associatedGame: any;
}) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [completing, setCompleting] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Scroll reading progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleToggleCompleted() {
    setCompleting(true);
    const res = await markArticleCompleted(article.id);
    setCompleting(false);
    if (res.success && res.data) {
      setIsCompleted(res.data.isCompleted);
    }
  }

  async function handleToggleBookmark() {
    const res = await toggleBookmark(article.id);
    if (res.success && res.data) {
      setIsBookmarked(res.data.bookmarked);
    }
  }

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format content for callout boxes and headings
  const renderFormattedContent = (content: string) => {
    // Quick custom parser for financial callouts, blockquotes, and tables
    const blocks = content.split("\n\n");
    return blocks.map((block, idx) => {
      if (block.startsWith("> ")) {
        const text = block.replace(/^> /, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <div key={idx} className="callout-box" dangerouslySetInnerHTML={{ __html: text }} />
        );
      }
      if (block.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-2xl font-bold text-white mt-8 mb-3 pb-2 border-b border-slate-800">
            {block.replace(/^## /, "")}
          </h2>
        );
      }
      if (block.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xl font-bold text-teal-300 mt-6 mb-2">
            {block.replace(/^### /, "")}
          </h3>
        );
      }
      if (block.startsWith("|")) {
        const rows = block.trim().split("\n");
        return (
          <div key={idx} className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <tbody>
                {rows.map((row, rIdx) => {
                  if (row.includes("---")) return null;
                  const cells = row.split("|").filter((c) => c.trim().length > 0);
                  const isHeader = rIdx === 0;
                  return (
                    <tr key={rIdx} className={isHeader ? "bg-slate-900 text-teal-400 font-bold" : "border-t border-slate-800"}>
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-300">
                          {cell.trim().replace(/\*\*(.*?)\*\*/g, "$1")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      if (block.startsWith("* ") || block.startsWith("- ")) {
        const items = block.split("\n");
        return (
          <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3 text-slate-300 text-sm">
            {items.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/^[\*\-]\s+/, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            ))}
          </ul>
        );
      }
      return (
        <p
          key={idx}
          className="text-slate-300 text-base leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
        />
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-900">
        <div
          className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <Link
          href={`/dashboard/courses/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course Syllabus</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isBookmarked
                ? "bg-teal-950/80 text-teal-400 border-teal-800"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
            }`}
            title="Bookmark Article"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-teal-400" : ""}`} />
            <span className="hidden sm:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>

          {/* Share / Copy Link */}
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
            title="Copy Article Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Mark Completed Toggle */}
          <button
            onClick={handleToggleCompleted}
            disabled={completing}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isCompleted
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : "bg-teal-600 hover:bg-teal-500 text-white"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? "Completed" : "Mark as Completed"}</span>
          </button>
        </div>
      </div>

      {/* Article Header Card */}
      <div className="finance-card p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded font-bold bg-teal-950 text-teal-400 border border-teal-800 uppercase text-[10px]">
            {course.category}
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {article.readingTimeMinutes} Minutes Estimated Read
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>
        <p className="text-base text-slate-300 leading-relaxed italic border-l-2 border-teal-500 pl-3">
          {article.summary}
        </p>
      </div>

      {/* Key Takeaways Executive Box */}
      {article.keyTakeaways && (
        <div className="finance-card p-6 border-teal-800/80 bg-slate-900/60 space-y-3">
          <div className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Executive Takeaways & Invalidation Principles</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line space-y-1">
            {article.keyTakeaways}
          </div>
        </div>
      )}

      {/* Main Formatted Article Prose */}
      <div className="finance-card p-6 md:p-10 space-y-2">
        <div className="article-prose">
          {renderFormattedContent(article.content)}
        </div>
      </div>

      {/* Associated Interactive Challenge Link */}
      {associatedGame && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 to-slate-900 border border-teal-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 shrink-0">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-teal-400">Knowledge Challenge</div>
              <h4 className="text-base font-bold text-white">{associatedGame.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5">Test your comprehension with the interactive simulator.</p>
            </div>
          </div>
          <Link
            href={`/dashboard/games/${associatedGame.slug}`}
            className="shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Play Challenge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Navigation Footer (Prev / Next Article) */}
      <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevArticle ? (
          <Link
            href={`/dashboard/courses/${course.slug}/${prevArticle.slug}`}
            className="w-full sm:w-auto p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center gap-3 group text-left"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-teal-400 group-hover:-translate-x-0.5 transition-all" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Previous Article</div>
              <div className="text-xs font-bold text-white group-hover:text-teal-300 truncate max-w-[200px]">
                {prevArticle.title}
              </div>
            </div>
          </Link>
        ) : (
          <div></div>
        )}

        {nextArticle ? (
          <Link
            href={`/dashboard/courses/${course.slug}/${nextArticle.slug}`}
            className="w-full sm:w-auto p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-end gap-3 group text-right"
          >
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Next Article</div>
              <div className="text-xs font-bold text-white group-hover:text-teal-300 truncate max-w-[200px]">
                {nextArticle.title}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
