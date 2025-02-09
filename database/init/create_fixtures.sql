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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    project_id INT REFERENCES projects(id) ON DELETE SET NULL
);

-- Criar tabela intermediária para associar projetos e tarefas
CREATE TABLE IF NOT EXISTS project_tasks (
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, task_id)
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

-- Inserir 20 tarefas fictícias associadas aos projetos
INSERT INTO tasks (title, description, category, project_id) VALUES
('Implementação de API', 'Criar API REST para serviço backend.', 'Backend', 1),
('Otimização de banco de dados', 'Melhorar desempenho de queries.', 'Backend', 1),
('Desenvolvimento de modelo de IA', 'Treinar modelo para previsões.', 'IA', 2),
('Análise de dados com IA', 'Gerar insights com machine learning.', 'IA', 2),
('Criação de wireframes', 'Definir layout para interface.', 'Design', 3),
('Prototipagem de interface', 'Criar protótipos interativos.', 'Design', 3),
('Escrita de testes unitários', 'Garantir qualidade do código.', 'Tester', 4),
('Automatização de testes', 'Criar scripts para testes automatizados.', 'Tester', 4),
('Refatoração de frontend', 'Melhorar código de componentes.', 'Frontend', 5),
('Criação de animações', 'Adicionar transições dinâmicas.', 'Frontend', 5),
('Segurança de API', 'Implementar autenticação JWT.', 'Backend', 1),
('Treinamento de chatbot', 'Melhorar respostas automáticas.', 'IA', 2),
('Redesenho de dashboard', 'Atualizar visualização de dados.', 'Design', 3),
('Testes de carga', 'Avaliar desempenho sob estresse.', 'Tester', 4),
('Integração de framework', 'Adicionar suporte a biblioteca nova.', 'Frontend', 5),
('Monitoramento de logs', 'Criar sistema de tracking de erros.', 'Backend', 1),
('Processamento de linguagem natural', 'Usar NLP para análise de textos.', 'IA', 2),
('Design responsivo', 'Melhorar adaptação para mobile.', 'Design', 3),
('Validação de componentes', 'Testar interatividade do frontend.', 'Tester', 4),
('Otimização de carregamento', 'Melhorar performance de frontend.', 'Frontend', 5);
