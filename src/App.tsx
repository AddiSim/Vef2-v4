import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import Detail from './components/Detail';
import Yfirlit from './components/Yfirlit';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/yfirlit" element={<Yfirlit />} />
          <Route path="games/:id" element={<Detail />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;