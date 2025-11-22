import { HashRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { TitleScreen } from './components/Screens/TitleScreen';
import { GameScreen } from './components/Screens/GameScreen';
import { ResultScreen } from './components/Screens/ResultScreen';
import { PlaceholderScreen } from './components/Screens/PlaceholderScreen';

function App() {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<TitleScreen />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/ranking" element={<PlaceholderScreen title="ランキング" />} />
          <Route path="/stats" element={<PlaceholderScreen title="プレイデータ" />} />
          <Route path="/trophies" element={<PlaceholderScreen title="トロフィー" />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}

export default App;
