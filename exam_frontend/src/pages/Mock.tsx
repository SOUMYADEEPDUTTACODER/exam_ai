import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../lib/api'

const Mock: React.FC = () => {
  const [exam, setExam] = React.useState('GATE CSE')
  const [topics, setTopics] = React.useState('DBMS, OS')
  const [count, setCount] = React.useState(5)
  const [currentQuestionValues, setCurrentQuestionValues] = React.useState<Record<number, string>>({})
  const [showResults, setShowResults] = React.useState(false)

  const genMutation = useMutation({
    mutationFn: async () => {
      // Send JSON body with topics array and count
      const res = await api.post(`/mock/generate/${encodeURIComponent(exam)}`, {
        topics: topics.split(',').map(t => t.trim()).filter(Boolean),
        count: Number(count)
      })
      return res.data
    },
    onSuccess: () => {
      setCurrentQuestionValues({})
      setShowResults(false)
    }
  })

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/mock/submit`, data)
      return res.data
    }
  })

  const handleOptionSelect = (qIndex: number, option: string) => {
    setCurrentQuestionValues(prev => ({
      ...prev,
      [qIndex]: option
    }))
  }

  const calculateScore = () => {
    if (!genMutation.data?.questions) return
    let score = 0
    genMutation.data.questions.forEach((q: any, idx: number) => {
      if (currentQuestionValues[idx] === q.answer) {
        score++
      }
    })

    // Submit results
    submitMutation.mutate({
      user_id: 'current_user', // Placeholder
      exam_name: exam,
      score: score,
      total: genMutation.data.questions.length,
      weak_topics: [] // Logic to calculate this could be added
    })

    setShowResults(true)
  }

  return (
    <div className="grid gap-6 p-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-black">Generate Mock Test</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Exam Name</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              placeholder="e.g. GATE CSE"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-black">Topics (comma separated)</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="e.g. DBMS, Operating Systems"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">No. of Questions</label>
            <input
              type="number"
              min={1}
              max={20}
              className="w-full border rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 5)}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => genMutation.mutate()}
            disabled={genMutation.isPending}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md px-6 py-2 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {genMutation.isPending ? 'Generating...' : 'Generate Questions'}
          </button>
        </div>
      </div>

      {genMutation.isError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
          Error generating questions. Please try again.
        </div>
      )}

      {genMutation.data?.questions && (
        <div className="grid gap-6">
          {genMutation.data.questions.map((q: any, idx: number) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold text-black">
                  {idx + 1}
                </span>
                <div className="flex-1 space-y-4">
                  <p className="font-medium text-lg text-black">{q.question_text}</p>
                  <div className="grid gap-3">
                    {q.options?.map((opt: string, optIdx: number) => {
                      const isSelected = currentQuestionValues[idx] === opt;
                      const isCorrect = showResults && opt === q.answer;
                      const isWrong = showResults && isSelected && opt !== q.answer;

                      let btnClass = "text-left px-4 py-3 rounded-md border transition-all hover:bg-gray-50 flex items-center justify-between group";
                      if (isCorrect) btnClass = "text-left px-4 py-3 rounded-md border bg-green-50 border-green-200 text-green-900 font-medium flex items-center justify-between";
                      else if (isWrong) btnClass = "text-left px-4 py-3 rounded-md border bg-red-50 border-red-200 text-red-900 flex items-center justify-between";
                      else if (isSelected) btnClass = "text-left px-4 py-3 rounded-md border border-primary-500 bg-primary-50 text-primary-900 flex items-center justify-between shadow-sm ring-1 ring-primary-500";
                      else btnClass = "text-left px-4 py-3 rounded-md border border-gray-200 hover:border-primary-200 hover:bg-gray-50 flex items-center justify-between text-black";

                      return (
                        <button
                          key={optIdx}
                          onClick={() => !showResults && handleOptionSelect(idx, opt)}
                          disabled={showResults}
                          className={btnClass}
                        >
                          <span className="text-black">{opt}</span>
                          {isSelected && !showResults && <span className="w-2 h-2 rounded-full bg-primary-600"></span>}
                          {isCorrect && <span className="text-green-700 font-bold">✓</span>}
                          {isWrong && <span className="text-red-700 font-bold">✗</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!showResults && genMutation.data.questions.length > 0 && (
            <div className="flex justify-end p-4">
              <button
                onClick={calculateScore}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-md px-8 py-3 shadow-md transition-all transform hover:scale-105"
              >
                Submit Test
              </button>
            </div>
          )}

          {showResults && submitMutation.data && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-2xl font-bold text-green-800">Test Completed!</h3>
              <p className="text-green-700 text-lg">
                Score: <span className="font-bold text-3xl">{submitMutation.variables?.score}</span> / {submitMutation.variables?.total}
              </p>
              <div className="bg-white p-4 rounded border border-green-100 text-left max-w-2xl mx-auto">
                <p className="font-medium text-black mb-2">AI Feedback:</p>
                <p className="text-gray-800 italic">
                  {submitMutation.data.feedback || "Good job! Keep practicing to improve your score."}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowResults(false)
                  setCurrentQuestionValues({})
                  genMutation.reset()
                  submitMutation.reset()
                }}
                className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
              >
                Start New Test
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Mock
