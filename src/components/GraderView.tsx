import React, { useState } from 'react';
import {
  FileCheck2,
  Send,
  Award,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Sparkles,
  User,
  Sliders,
  Check,
} from 'lucide-react';
import { Language, GradeResponse, TeacherFeedbackItem } from '../types';
import { INITIAL_TEACHER_FEEDBACK } from '../data/curriculum';
import { gradeAssignment } from '../services/api';

interface GraderViewProps {
  currentLanguage: Language;
  isTeacherMode: boolean;
}

const SAMPLE_ASSIGNMENT_PROMPTS = [
  {
    title: 'Python DSA: Reverse a Singly Linked List',
    subject: 'Computer Science & Coding',
    gradeLevel: 'Undergraduate / College (BS CS / Math / Sciences)',
    question: 'Write an iterative function in Python to reverse a singly linked list in O(n) time and O(1) space.',
    studentWork: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Verified with test case [1, 2, 3, 4] -> [4, 3, 2, 1]`,
  },
  {
    title: 'Calculus: Integration by Substitution (∫ 2x * cos(x^2) dx)',
    subject: 'Mathematics',
    gradeLevel: 'Class 11-12 (Higher Secondary / FSc / A-Level)',
    question: 'Evaluate the indefinite integral ∫ 2x * cos(x^2) dx using u-substitution. State u, du, and substitute clearly.',
    studentWork: `Let u = x^2
du = 2x dx => dx = du / (2x)

Substitute into the integral:
∫ 2x * cos(u) * (du / 2x) = ∫ cos(u) du
= sin(u) + C

Substitute back u = x^2:
= sin(x^2) + C

Verification by differentiation:
d/dx [sin(x^2) + C] = cos(x^2) * 2x = 2x*cos(x^2)  (Matches original integrand!)`,
  },
  {
    title: 'Islamic History: Bayt al-Hikmah (House of Wisdom)',
    subject: 'Islamic Studies & History',
    gradeLevel: 'Class 9-10 (Secondary / Matric / O-Level)',
    question: 'Analyze the significance of Bayt al-Hikmah in Baghdad during the Abbasid Caliphate and its translation movement.',
    studentWork: `The House of Wisdom (Bayt al-Hikmah), founded during the Abbasid era under Caliphs Harun al-Rashid and Al-Ma'mun, was a premier intellectual center. Scholars translated Greek, Persian, Sanskrit, and Syrian texts into Arabic. Figures like Al-Khwarizmi formulated algebra here, while Hunayn ibn Ishaq translated medical works. This preserved world knowledge and triggered the Islamic Golden Age.`,
  }
];

export const GraderView: React.FC<GraderViewProps> = ({ currentLanguage, isTeacherMode }) => {
  const [assignmentTitle, setAssignmentTitle] = useState(SAMPLE_ASSIGNMENT_PROMPTS[0].title);
  const [subject, setSubject] = useState(SAMPLE_ASSIGNMENT_PROMPTS[0].subject);
  const [gradeLevel, setGradeLevel] = useState(SAMPLE_ASSIGNMENT_PROMPTS[0].gradeLevel);
  const [assignmentQuestion, setAssignmentQuestion] = useState(SAMPLE_ASSIGNMENT_PROMPTS[0].question);
  const [studentSubmission, setStudentSubmission] = useState(SAMPLE_ASSIGNMENT_PROMPTS[0].studentWork);
  const [rubric, setRubric] = useState('Standard Academic Rubric: Accuracy (40%), Methodology (30%), Rigor & Efficiency (20%), Clarity (10%)');

  const [loading, setLoading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResponse | null>(null);

  // Teacher feedback loops list
  const [feedbackList, setFeedbackList] = useState<TeacherFeedbackItem[]>(INITIAL_TEACHER_FEEDBACK);
  const [newTeacherNote, setNewTeacherNote] = useState('');
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);

  const handleGrade = async () => {
    if (!studentSubmission.trim()) return;
    setLoading(true);

    try {
      const result = await gradeAssignment({
        assignmentTitle,
        assignmentQuestion,
        studentSubmission,
        subject,
        gradeLevel,
        rubric,
        language: currentLanguage,
      });

      setGradeResult(result);
    } catch (err: any) {
      console.error('Grading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacherFeedback = (id: string) => {
    if (!newTeacherNote.trim()) return;
    setFeedbackList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              notes: item.notes + `\n\n[Teacher Update]: ${newTeacherNote}`,
              status: 'Approved',
            }
          : item
      )
    );
    setNewTeacherNote('');
    setSelectedFeedbackId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Automated Assignment Grader & Teacher Feedback Loop
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rubric-based evaluation, detailed score breakdown, personalized feedback, and teacher review loops
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Sample Submissions:</span>
          {SAMPLE_ASSIGNMENT_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAssignmentTitle(p.title);
                setSubject(p.subject);
                setGradeLevel(p.gradeLevel);
                setAssignmentQuestion(p.question);
                setStudentSubmission(p.studentWork);
                setGradeResult(null);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition"
            >
              {p.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Submission Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Title:
            </label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Grade Level:
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Question / Assignment Prompt:
          </label>
          <textarea
            value={assignmentQuestion}
            onChange={(e) => setAssignmentQuestion(e.target.value)}
            rows={2}
            className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>Student Submission (Code, Mathematical Proof, or Essay):</span>
            <span className="text-[11px] text-slate-400 font-normal">Supports Python, C++, Math derivation & Urdu text</span>
          </label>
          <textarea
            value={studentSubmission}
            onChange={(e) => setStudentSubmission(e.target.value)}
            rows={6}
            placeholder="Paste student work here..."
            className="w-full p-3 font-mono text-xs rounded-xl bg-slate-900 text-emerald-400 dark:bg-slate-950 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Rubric: Standard Academic Rubric (0-100 Scale)</span>
          </div>

          <button
            onClick={handleGrade}
            disabled={loading || !studentSubmission.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-md shadow-emerald-500/20 disabled:opacity-50 transition"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Grading Submission & Generating Rubric...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Evaluate & Grade with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Grading Report */}
      {gradeResult && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-6 space-y-6">
          {/* Header Score Overview */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Automated Academic Assessment
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {gradeResult.assignmentTitle}
              </h3>
            </div>

            {/* Score & Letter Grade Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {gradeResult.overallScore} / 100
                </div>
                <div className="text-[11px] font-semibold text-slate-500">Overall Grade</div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
                {gradeResult.letterGrade}
              </div>
            </div>
          </div>

          {/* Rubric Breakdown Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rubric Criteria Breakdown:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gradeResult.criteria.map((c, idx) => {
                const percentage = Math.round((c.score / c.maxScore) * 100);
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {c.score} / {c.maxScore} ({percentage}%)
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{c.comment}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Improvement Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Demonstrated Strengths
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                {gradeResult.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Target Areas for Improvement
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                {gradeResult.areasForImprovement.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Personalized Teacher Feedback Note */}
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Personalized Teacher Feedback & Guidance
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
              "{gradeResult.teacherFeedback}"
            </p>
            <div className="pt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Recommended Next Action: {gradeResult.recommendedAction}
            </div>
          </div>
        </div>
      )}

      {/* Teacher Feedback Loop History Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Teacher Feedback Loops & Revision Records
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {feedbackList.length} Archived Reviews
          </span>
        </div>

        <div className="space-y-3">
          {feedbackList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {item.assignmentTitle}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Evaluator: {item.teacherName} • {item.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {item.rating}%
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                "{item.notes}"
              </p>

              {item.responseFromStudent && (
                <div className="pl-3 border-l-2 border-indigo-400 text-[11px] text-indigo-700 dark:text-indigo-300 italic">
                  Student reply: "{item.responseFromStudent}"
                </div>
              )}

              {/* Add Note Button for Teacher Mode */}
              {isTeacherMode && (
                <div className="pt-1">
                  {selectedFeedbackId === item.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={newTeacherNote}
                        onChange={(e) => setNewTeacherNote(e.target.value)}
                        placeholder="Add additional teacher remarks or revision notes..."
                        className="w-full p-2 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedFeedbackId(null)}
                          className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAddTeacherFeedback(item.id)}
                          className="px-3 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        >
                          Save Feedback Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedFeedbackId(item.id)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      + Add Instructor Revision Note
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
