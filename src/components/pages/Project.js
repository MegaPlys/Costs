import styles from './Project.module.css'
import Loading from '../layout/Loading'
import Container from '../layout/Container'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Project() {

    // Extrai o parâmetro 'id' da URL
    const { id } = useParams()
    
    // Define o estado para armazenar os dados do projeto
    const [project, setProject] = useState([])

    // Define o estado para controlar a exibição do formulário de edição
    const [showProjectForm, setShowProjectForm] = useState(false)

    useEffect(() => {

        // Adiciona um atraso de 300ms antes de fazer a requisição
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data)
                })
                .catch((err) => console.log(err))
        }, 300)
        
    }, [id])
    
    // Função para alternar a exibição do formulário de edição
    function toggleProjectForm() { 

        setShowProjectForm(!showProjectForm)

    }

    return (
        <>
        {project.name ? (
        <div className={styles.project_details}>
            <Container customClass="column"> 
                <div className={styles.details_container}>
                    <h1>Projeto: {project.name}</h1>
                    <button className={styles.btn} onClick={toggleProjectForm}>
                        {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                    </button>
                    {!showProjectForm ? ( // detalhes do projeto
                        <div className={styles.project_info}>
                            <p>
                                <span>Categoria: </span> {project.category.name}    
                            </p>    
                            <p>
                                <span>Total de Orçamento: </span> R${project.budget}
                            </p>
                            <p>
                                <span>Total Utilizado: </span> R${project.cost}
                            </p>
                        </div>
                    ) : ( // editar projeto
                        <div className={styles.project_info}>
                            <p>formulario</p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
        ) : (<Loading/>
        )}
        </>
    )
}

export default Project