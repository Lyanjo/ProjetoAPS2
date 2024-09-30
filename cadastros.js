import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://jzijhoertjzjurmghbzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aWpob2VydGp6anVybWdoYnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NTg4ODMsImV4cCI6MjA0MTAzNDg4M30.A6MMeZO3kkzYHRJUxka1q3L7owb60BqIBxe5TBHQKPc';
const supabase = createClient(supabaseUrl, supabaseKey);

window.toggleCadastro = function() {
    const tipoCadastro = document.getElementById('tipo-cadastro').value;
    document.getElementById('cadastro-paciente').style.display = tipoCadastro === 'paciente' ? 'block' : 'none';
    document.getElementById('cadastro-profissional').style.display = tipoCadastro === 'profissional' ? 'block' : 'none';
};

window.savePatient = async function() {
    const email = document.getElementById('email-paciente').value;
    const telefone = document.getElementById('telefone-paciente').value;

    // Regex para validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regex para validar telefone (considerando que o DDD já está no formato correto)
    const telefoneRegex = /^\d{2}\d{9}$/; // 2 dígitos para DDD + 9 dígitos para telefone

    // Verificação de e-mail
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Verificação de telefone
    if (!telefoneRegex.test(telefone)) {
        alert('Por favor, insira um telefone válido (DDD + 9 dígitos).');
        return;
    }

    const patientData = {
        nome: document.getElementById('nome-paciente').value,
        email: email,
        datanascimento: document.getElementById('nascimento-paciente').value,
        documento: document.getElementById('documento-paciente').value,
        contato: telefone,
    };

    const { data, error } = await supabase
        .from('pacientes')
        .insert([patientData]);

    if (error) {
        console.error('Erro ao cadastrar paciente:', error);
        alert('Erro ao cadastrar paciente. Veja o console para mais detalhes.');
        return;
    }

    console.log('Paciente cadastrado com sucesso:', data);
    alert('Paciente cadastrado com sucesso!');
    // Limpar o formulário após o sucesso
    document.getElementById('cadastro-paciente-form').reset();
};

window.saveProfessional = async function() {
    const email = document.getElementById('email-profissional').value;
    const telefone = document.getElementById('telefone-profissional').value;

    // Regex para validar e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Regex para validar telefone
    const telefoneRegex = /^\d{2}\d{9}$/; // 2 dígitos para DDD + 9 dígitos para telefone

    // Verificação de e-mail
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Verificação de telefone
    if (!telefoneRegex.test(telefone)) {
        alert('Por favor, insira um telefone válido (DDD + 9 dígitos).');
        return;
    }

    const professionalData = {
        nome: document.getElementById('nome-profissional').value,
        crp: document.getElementById('crp').value,
        especialidade: document.getElementById('especialidade').value,
        telefone: telefone,
        email: email,
    };

    const { data, error } = await supabase
        .from('profissionais')
        .insert([professionalData]);

    if (error) {
        console.error('Erro ao cadastrar profissional:', error);
        alert('Erro ao cadastrar profissional. Veja o console para mais detalhes.');
        return;
    }

    console.log('Profissional cadastrado com sucesso:', data);
    alert('Profissional cadastrado com sucesso!');
    // Limpar o formulário após o sucesso
    document.getElementById('cadastro-profissional-form').reset();
};
