import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Navbar } from 'react-bootstrap'

export function WorkshopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)
  return <Navbar as="header" className="nav">
    <a className="brand" href="#top">AOM <span>/</span> 2026</a>
    <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
      <a href="#about" onClick={close}>ABOUT</a><a href="#learn" onClick={close}>WHAT YOU'LL LEARN</a><a href="#flow" onClick={close}>HOW IT WORKS</a><a href="#lab" onClick={close}>CREATE</a>
    </nav>
    <a className="nav-join" href="#join">JOIN WORKSHOP <ArrowUpRight size={15} /></a>
    <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
  </Navbar>
}