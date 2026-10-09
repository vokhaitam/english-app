import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import Sidebar from './components/Sidebar';
import Mascot from './components/Mascot';

const HomePage = lazy(() => import('./pages/HomePage'));
const StudyPage = lazy(() => import('./pages/StudyPage'));
const GrammarPage = lazy(() => import('./pages/GrammarPage'));
const GrammarPracticePage = lazy(() => import('./pages/GrammarPracticePage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const ListeningPage = lazy(() => import('./pages/ListeningPage'));
const KanaPage = lazy(() => import('./pages/KanaPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const WordRainPage = lazy(() => import('./pages/WordRainPage'));
const TypingPracticePage = lazy(() => import('./pages/TypingPracticePage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const MyDecksPage = lazy(() => import('./pages/MyDecksPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const MemoryMatchPage = lazy(() => import('./pages/MemoryMatchPage'));
const WordScramblePage = lazy(() => import('./pages/WordScramblePage'));
const ListeningChallengePage = lazy(() => import('./pages/ListeningChallengePage'));
const SentenceBuilderPage = lazy(() => import('./pages/SentenceBuilderPage'));
const IPhoneInstallPage = lazy(() => import('./pages/IPhoneInstallPage'));

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
  if (location.pathname.startsWith('/games')) return null;
  return <Mascot />;
}

// Popup "+XP" bay từ góc phải trên khi nhận thưởng.
function XpToastLayer() {
  const { xpToasts } = useApp();
  if (!xpToasts?.length) return null;
  return (
    <div className="xp-toast-layer" aria-live="polite">
      {xpToasts.map(t => (
        <div key={t.id} className="xp-toast">
          <span className="xp-toast-icon">✨</span>
          <span className="xp-toast-value">+{t.amount} XP</span>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
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
                  <Route path="/kana" element={<KanaPage />} />
                  <Route path="/review" element={<ReviewPage />} />
                  <Route path="/listening" element={<ListeningPage />} />
                  <Route path="/quiz" element={<QuizPage />} />
                  <Route path="/word-rain" element={<WordRainPage />} />
                  <Route path="/typing-practice" element={<TypingPracticePage />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/my-decks" element={<MyDecksPage />} />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/games/memory-match" element={<MemoryMatchPage />} />
                  <Route path="/games/word-scramble" element={<WordScramblePage />} />
                  <Route path="/games/listening-challenge" element={<ListeningChallengePage />} />
                  <Route path="/games/sentence-builder" element={<SentenceBuilderPage />} />
                  <Route path="/cai-app-iphone" element={<IPhoneInstallPage />} />
                </Routes>
              </Suspense>
            </main>
            <SmartMascot />
            <XpToastLayer />
          </div>
        </Router>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;