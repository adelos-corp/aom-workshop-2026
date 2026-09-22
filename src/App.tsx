import './index.css';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Process from './components/Process';
import Build from './components/Build';
import SecondYear from './components/SecondYear';
import Deploy from './components/Deploy';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Process />
        <Build />
        <SecondYear />
        <Deploy />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
