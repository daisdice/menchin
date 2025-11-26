import { HashRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { TitleScreen } from './components/Screens/TitleScreen';
import { ModeSelectScreen } from './components/Screens/ModeSelectScreen';
import { DifficultySelectScreen } from './components/Screens/DifficultySelectScreen';
import { GameScreen } from './components/Screens/GameScreen';
import { ResultScreen } from './components/Screens/ResultScreen';
import { OptionsScreen } from './components/Screens/OptionsScreen';
import { PlaceholderScreen } from './components/Screens/PlaceholderScreen';

function App() {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<TitleScreen />} />
          <Route path="/mode" element={<ModeSelectScreen />} />
          <Route path="/difficulty/:mode" element={<DifficultySelectScreen />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/options" element={<OptionsScreen />} />
          <Route path="/ranking" element={<PlaceholderScreen title="RECORD" />} />
          <Route path="/stats" element={<PlaceholderScreen title="SUMMARY" />} />
          <Route path="/trophies" element={<PlaceholderScreen title="TROPHY" />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
}

export default App;
