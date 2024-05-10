import { useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

import Message from "../layout/Message";
import Container from "../layout/Container";
import Loading from "../layout/Loading";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";

import styles from "./Projects.module.css"


function Projects() {
    // const pra salvar os projetos
    const [projects, setProjects] = useState([])
    const [removeLoading, setRemoveLoading] = useState(false)

    const location = useLocation()

    let message = ''

    if(location.state) {
        message = location.state.message
    }

    useEffect(() => { 
        // setTimeout só pra mostrar loader na tela
        setTimeout(() => {
//useEffect para pegar do db.json os projetos salvos 
            fetch('http://localhost:5000/projects', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            setProjects(data)
            setRemoveLoading(true)
        })
        .catch((err) => console.log(err))

        }, 300)
    }, [])

    return (
        <div className={styles.project_container}>
            <div className={styles.tittle_container}>
                <h1>Meus Projetos</h1>
                { /* link botão para criar novo projeto */ }
                <LinkButton to="/newproject" text="Criar Projeto" />  
            </div>
            {message && <Message type="sucess" msg={message} />}

            { /* Área de todos os projetos listados */ }
            <Container customClass="start">
                {projects.length > 0 &&
                    projects.map((project) => <ProjectCard 
                    id={project.id}
                    name={project.name} 
                    budget={project.budget}
                    category={project.category.name}
                    key={project.id}
                />)}
                {/* svg loading aqui */}
                {!removeLoading && <Loading />}
                {removeLoading && projects.lenght === 0 && (
                    <p>Não há Projetos cadastrados  </p>
                )
                }
            </Container>
        </div>
    )

}

export default Projects;