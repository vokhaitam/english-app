import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Mascot from './components/Mascot';

const HomePage = lazy(() => import('./pages/HomePage'));
const StudyPage = lazy(() => import('./pages/StudyPage'));
const GrammarPage = lazy(() => import('./pages/GrammarPage'));
const GrammarPracticePage = lazy(() => import('./pages/GrammarPracticePage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const ListeningPage = lazy(() => import('./pages/ListeningPage'));
const DailySentencePage = lazy(() => import('./pages/DailySentencePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const WordRainPage = lazy(() => import('./pages/WordRainPage'));
const TypingPracticePage = lazy(() => import('./pages/TypingPracticePage'));
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <span className="text-muted">Đang tải...</span>
    </div>
  );
}

function SmartMascot() {
  const location = useLocation();
  if (['/review', '/word-rain', '/typing-practice'].includes(location.pathname)) return null;
  return <Mascot />;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/study" element={<StudyPage />} />
                <Route path="/grammar" element={<GrammarPage />} />
                <Route path="/grammar-practice" element={<GrammarPracticePage />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route path="/listening" element={<ListeningPage />} />
                <Route path="/daily-sentence" element={<DailySentencePage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/word-rain" element={<WordRainPage />} />
<Route path="/typing-practice" element={<TypingPracticePage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/stats" element={<StatsPage />} />
              </Routes>
            </Suspense>
          </main>
<SmartMascot />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;