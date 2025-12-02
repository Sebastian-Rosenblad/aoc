import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import { challengesSorted } from './challenges';
import CopyToast from './components/CopyToast';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        {challengesSorted.map((challenge) => (
          <Route key={challenge.path} path={challenge.path} element={<challenge.Component />} />
        ))}
      </Routes>
      <CopyToast />
    </BrowserRouter>
  );
}
