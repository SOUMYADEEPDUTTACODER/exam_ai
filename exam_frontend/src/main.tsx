import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

const queryClient = new QueryClient()

const Home = React.lazy(() => import('./pages/Home'))
const Syllabus = React.lazy(() => import('./pages/Syllabus'))
const Study = React.lazy(() => import('./pages/Study'))
const Questions = React.lazy(() => import('./pages/Questions'))
const Mock = React.lazy(() => import('./pages/Mock'))
const Progress = React.lazy(() => import('./pages/Progress'))

const AppLayout = React.lazy(() => import('./shared/AppLayout'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <React.Suspense fallback={<div className="p-4">Loading...</div>}>
        <AppLayout />
      </React.Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'syllabus', element: <Syllabus /> },
      { path: 'study', element: <Study /> },
      { path: 'questions', element: <Questions /> },
      { path: 'mock', element: <Mock /> },
      { path: 'progress', element: <Progress /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)


