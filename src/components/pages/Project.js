import styles from './Project.module.css'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Project() {

    // Extrai o parâmetro 'id' da URL
    const { id } = useParams()
    
    // Define o estado para armazenar os dados do projeto
    const [project, setProject] = useState([])

    // Define o estado para controlar a exibição do formulário de edição
    const [showProjectForm, setShowProjectForm] = useState(false)


    const [showServiceForm, setShowServiceForm] = useState(false)

     // Define o estado para mensagens de feedback
    const [message, setMessage] = useState('')
    const [type, setType] = useState('')

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

    function editPost(project) {

        //budget validation
        if(project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto!')
            setType('error')
            return false
        }

        fetch(`http://localhost:5000/projects/${project.id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(project),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setShowProjectForm(false)
            setMessage('Projeto atualizado!')
            setType('success')
        })
        .catch(err => console.log(err))
    }
    
    // Função para alternar a exibição do formulário de edição
    function toggleProjectForm() { 

        setShowProjectForm(!showProjectForm)

    }

    function toggleServiceForm() {

        setShowServiceForm(!showServiceForm)
    }

    return (
        <>
        {project.name ? (
        <div className={styles.project_details}>
            <Container customClass="column"> 
                {message && <Message type={type} msg={message}/>}
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
                            <ProjectForm 
                            handleSubmit={editPost}
                            btnText="Concluir edição"
                            projectData={project}
                            />
                        </div>
                    )}
                </div>
                <div className={styles.service_form_container}>
                    <h2>Adicione um serviço:</h2>
                    <button className={styles.btn} onClick={toggleServiceForm}>
                        {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                    </button>
                    <div className={styles.project_info}>
                        {showServiceForm && <div>Form do serviço</div>}
                    </div> 
                </div>
                <h2>Serviços</h2>
                <Container customClass="start">
                    <p>itens de serviço</p>
                </Container>
            </Container>
        </div>
        ) : (<Loading/>
        )}
        </>
    )
}

export default Project