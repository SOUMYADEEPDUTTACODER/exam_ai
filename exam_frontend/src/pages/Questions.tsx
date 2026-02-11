import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

type Question = { question_text: string; options: string[]; answer: string }

const Questions: React.FC = () => {
  const [exam, setExam] = React.useState('GATE CSE')
  const [topic, setTopic] = React.useState('DBMS')
  const [count, setCount] = React.useState(5)

  const { data, isFetching, refetch } = useQuery<{ questions: Question[] }>({
    queryKey: ['questions', exam, topic, count],
    queryFn: async () => {
      const res = await api.get(`/study/questions/${encodeURIComponent(exam)}/${encodeURIComponent(topic)}`, {
        params: { count }
      })
      return res.data
    },
    enabled: false,
  })

  return (
    <div className="grid gap-6 p-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Study Questions Generator</h2>
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Topic</label>
            <input
              className="w-full border rounded-md px-3 py-2 text-black focus:ring-2 focus:ring-primary-500 outline-none bg-white"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. DBMS"
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
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md px-4 py-2 transition-colors disabled:opacity-50 h-[42px]"
          >
            {isFetching ? 'Generating...' : 'Get Questions'}
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {data?.questions?.map((q, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold text-black border border-gray-200">
                {idx + 1}
              </span>
              <div className="flex-1 space-y-3">
                <p className="font-medium text-lg text-black">{q.question_text}</p>
                <div className="grid gap-2">
                  {q.options?.map((o, i) => {
                    const isAnswer = o === q.answer;
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-md border text-base ${isAnswer ? 'bg-green-50 border-green-200 text-green-900 font-medium' : 'bg-gray-50 border-gray-200 text-black'}`}
                      >
                        <span className="mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span> {o} {isAnswer && <span className="float-right text-green-700 font-bold">✓ Answer</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {data?.questions?.length === 0 && !isFetching && (
          <div className="text-center p-8 text-black">
            No questions found. Click "Get Questions" to generate some.
          </div>
        )}
      </div>
    </div>
  )
}

export default Questions
