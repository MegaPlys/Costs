import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
// Importa componentes do react-router-dom para configurar a navegação.

import Home from "./components/pages/Home"; 
import Company from "./components/pages/Company";
import Contact from "./components/pages/Contact";
import NewProject from "./components/pages/NewProject";
import Projects from "./components/pages/Projects";
import Project from "./components/pages/Project";
// Importa os componentes de página que serão usados nas rotas.

import Container from "./components/layout/Container";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
// Importa componentes de layout (Container, Navbar, Footer) que serão usados em toda a aplicação.

function App() { 
  return (
    // Define o roteamento da aplicação.
    <Router>
      <Navbar /> 
      {/* Renderiza o componente Navbar em todas as páginas. */}
      
      <Container customClass="min-height"> 
      {/* Usa o componente Container para envolver as rotas, aplicando uma classe CSS personalizada. */}
        
        <Routes>
          {/* Define as rotas da aplicação. */}
          <Route path="/" element={<Home />} />
          {/* Rota para a página inicial (Home). */}
          <Route path="/company" element={<Company />} />
          {/* Rota para a página da empresa (Company). */}
          <Route path="/contact" element={<Contact />} />
          {/* Rota para a página de contato (Contact). */}
          <Route path="/newproject" element={<NewProject />} />
          {/* Rota para a página de criação de novo projeto (NewProject). */}
          <Route path="/projects" element={<Projects />} />
          {/* Rota para a página de projetos (Projects). */}
          <Route path="/project/:id" element={<Project />} />
          {/* Rota para a página de um projeto específico, identificado por um ID (Project). */}
        </Routes>
      </Container>
      
      <Footer /> 
      {/* Renderiza o componente Footer em todas as páginas. */}
    </Router>
  );
}

export default App; 
// Exporta o componente App como padrão.
