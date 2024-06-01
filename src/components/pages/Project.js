// Importa as funções parse e v4 da biblioteca uuid para gerar IDs únicos
import { parse, v4 as uuidv4 } from 'uuid';

// Importa os estilos específicos para o componente Project
import styles from './Project.module.css';

// Importa componentes reutilizáveis
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';
import Message from '../layout/Message';

// Importa hooks do React Router e do React
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Project() {
    // Extrai o parâmetro 'id' da URL
    const { id } = useParams();

    // Define o estado para armazenar os dados do projeto
    const [project, setProject] = useState([]);

    // Define o estado para armazenar os serviços do projeto
    const [services, setServices] = useState([]);

    // Define o estado para controlar a exibição do formulário de edição de projeto
    const [showProjectForm, setShowProjectForm] = useState(false);

    // Define o estado para controlar a exibição do formulário de criação de serviço
    const [showServiceForm, setShowServiceForm] = useState(false);

    // Define o estado para mensagens de feedback
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');

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
                    setProject(data);
                    setServices(data.services);
                })
                .catch((err) => console.log(err));
        }, 300);
    }, [id]);

    // Função para editar um projeto existente
    function editPost(project) {
        setMessage('');

        // Validação de orçamento
        if (project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo do projeto!');
            setType('error');
            return false;
        }

        // Envia a atualização do projeto para o servidor
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setShowProjectForm(false);
                setMessage('Projeto atualizado!');
                setType('success');
            })
            .catch((err) => console.log(err));
    }

    // Função para criar um novo serviço dentro do projeto
    function createService(project) {
        setMessage('');

        // Obtém o último serviço adicionado ao projeto
        const lastService = project.services[project.services.length - 1];
        lastService.id = uuidv4(); // Gera um ID único para o serviço

        const lastServiceCost = lastService.cost;
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

        // Validação de valor máximo do orçamento
        if (newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço');
            setType('error');
            project.services.pop();
            return false;
        }

        // Adiciona o custo do serviço ao custo total do projeto
        project.cost = newCost;

        // Envia a atualização do projeto para o servidor
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setShowServiceForm(false);
                setProject(project); // Atualiza o estado do projeto
                setServices(project.services); // Atualiza o estado dos serviços
                setMessage('Serviço adicionado com sucesso!');
                setType('success');
            })
            .catch((err) => console.log(err));
    }

    // Função para remover um serviço do projeto
    function removeService(id, cost) {
        // Filtra para manter apenas os serviços que não têm o ID fornecido
        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        );

        const projectUpdated = { ...project }; // Faz uma cópia do projeto
        projectUpdated.services = servicesUpdated;
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

        // Envia a atualização do projeto para o servidor
        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectUpdated),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(projectUpdated);
                setServices(servicesUpdated);
                setMessage('Serviço removido com sucesso!');
                setType('success');
            })
            .catch((err) => console.log(err));
    }

    // Função para alternar a exibição do formulário de edição de projeto
    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    // Função para alternar a exibição do formulário de criação de serviço
    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            {project.name ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message} />}
                        <div className={styles.details_container}>
                            <h1>Projeto: {project.name}</h1>
                            <button className={styles.btn} onClick={toggleProjectForm}>
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>
                            {!showProjectForm ? (
                                // Detalhes do projeto
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
                            ) : (
                                // Formulário para editar o projeto
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
                                {showServiceForm && (
                                    <ServiceForm
                                        handleSubmit={createService}
                                        btnText="Adicionar Serviço"
                                        projectData={project}
                                    />
                                )}
                            </div>
                        </div>
                        <h2>Serviços</h2>
                        <Container customClass="start">
                            {services.length > 0 &&
                                services.map((service) => (
                                    <ServiceCard
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        key={service.id}
                                        handleRemove={removeService}
                                    />
                                ))}
                            {services.length === 0 && (
                                <p>Não há serviços cadastrados.</p>
                            )}
                        </Container>
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Project;
