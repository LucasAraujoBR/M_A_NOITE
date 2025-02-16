-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    personality TEXT[],
    level VARCHAR(50),
    areas TEXT[] CHECK (areas <@ ARRAY['Backend', 'Frontend', 'IA', 'Design', 'Tester']),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela intermediária para associar projetos e tarefas (N:N)
CREATE TABLE IF NOT EXISTS project_tasks (
    project_id INT NOT NULL,
    task_id INT NOT NULL,
    PRIMARY KEY (project_id, task_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Inserir 10 usuários fictícios
INSERT INTO users (name, email, personality, level, areas) VALUES
('Lucas Silva', 'lucas@email.com', ARRAY['Analítico', 'Criativo'], 'Sênior', ARRAY['Backend', 'IA']),
('Mariana Costa', 'mariana@email.com', ARRAY['Empático', 'Organizado'], 'Pleno', ARRAY['Frontend', 'Design']),
('Roberto Lima', 'roberto@email.com', ARRAY['Estratégico', 'Persuasivo'], 'Júnior', ARRAY['Tester', 'Backend']),
('Ana Souza', 'ana@email.com', ARRAY['Racional', 'Detalhista'], 'Pleno', ARRAY['IA', 'Frontend']),
('Carlos Mendes', 'carlos@email.com', ARRAY['Dinâmico', 'Pragmático'], 'Sênior', ARRAY['Backend', 'Tester']),
('Fernanda Rocha', 'fernanda@email.com', ARRAY['Assertivo', 'Paciente'], 'Júnior', ARRAY['Design', 'Frontend']),
('Diego Farias', 'diego@email.com', ARRAY['Criativo', 'Visionário'], 'Sênior', ARRAY['IA', 'Backend']),
('Tatiane Alves', 'tatiane@email.com', ARRAY['Detalhista', 'Analítico'], 'Pleno', ARRAY['Tester', 'Design']),
('Gabriel Martins', 'gabriel@email.com', ARRAY['Estratégico', 'Lógico'], 'Sênior', ARRAY['Frontend', 'IA']),
('Bianca Nogueira', 'bianca@email.com', ARRAY['Empático', 'Resiliente'], 'Júnior', ARRAY['Design', 'Tester']);

-- Inserir 5 projetos fictícios
INSERT INTO projects (name, description) VALUES
('Desenvolvimento Backend', 'Projeto para criar sistemas escaláveis.'),
('Integração de IA', 'Uso de inteligência artificial em aplicações.'),
('UI/UX Design', 'Melhoria da experiência do usuário.'),
('Testes Automatizados', 'Automatização de processos de QA.'),
('Frontend Dinâmico', 'Criação de interfaces responsivas.');

-- Inserir 20 tarefas fictícias
INSERT INTO tasks (title, description, category) VALUES
('Implementação de API', 'Criar API REST para serviço backend.', 'Backend'),
('Otimização de banco de dados', 'Melhorar desempenho de queries.', 'Backend'),
('Desenvolvimento de modelo de IA', 'Treinar modelo para previsões.', 'IA'),
('Análise de dados com IA', 'Gerar insights com machine learning.', 'IA'),
('Criação de wireframes', 'Definir layout para interface.', 'Design'),
('Prototipagem de interface', 'Criar protótipos interativos.', 'Design'),
('Escrita de testes unitários', 'Garantir qualidade do código.', 'Tester'),
('Automatização de testes', 'Criar scripts para testes automatizados.', 'Tester'),
('Refatoração de frontend', 'Melhorar código de componentes.', 'Frontend'),
('Criação de animações', 'Adicionar transições dinâmicas.', 'Frontend'),
('Segurança de API', 'Implementar autenticação JWT.', 'Backend'),
('Treinamento de chatbot', 'Melhorar respostas automáticas.', 'IA'),
('Redesenho de dashboard', 'Atualizar visualização de dados.', 'Design'),
('Testes de carga', 'Avaliar desempenho sob estresse.', 'Tester'),
('Integração de framework', 'Adicionar suporte a biblioteca nova.', 'Frontend'),
('Monitoramento de logs', 'Criar sistema de tracking de erros.', 'Backend'),
('Processamento de linguagem natural', 'Usar NLP para análise de textos.', 'IA'),
('Design responsivo', 'Melhorar adaptação para mobile.', 'Design'),
('Validação de componentes', 'Testar interatividade do frontend.', 'Tester'),
('Otimização de carregamento', 'Melhorar performance de frontend.', 'Frontend');

-- Inserir associações entre projetos e tarefas (N:N)
INSERT INTO project_tasks (project_id, task_id) VALUES
(1, 1), (1, 2), (1, 11), (1, 16),
(2, 3), (2, 4), (2, 12), (2, 17),
(3, 5), (3, 6), (3, 13), (3, 18),
(4, 7), (4, 8), (4, 14), (4, 19),
(5, 9), (5, 10), (5, 15), (5, 20);
