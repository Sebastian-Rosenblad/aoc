import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import { challengesSorted } from './challenges';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        {challengesSorted.map((challenge) => (
          <Route key={challenge.path} path={challenge.path} element={<challenge.Component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
