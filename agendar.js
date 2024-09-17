import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://jzijhoertjzjurmghbzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aWpob2VydGp6anVybWdoYnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NTg4ODMsImV4cCI6MjA0MTAzNDg4M30.A6MMeZO3kkzYHRJUxka1q3L7owb60BqIBxe5TBHQKPc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadOptions() {
    try {
        // Carregar pacientes
        const { data: patients, error: patientError } = await supabase
            .from('pacientes')
            .select('idpaciente, nome')
            .order('nome', { ascending: true });
        
        if (patientError) {
            console.error('Erro ao carregar pacientes:', patientError);
            return;
        }

        // Preencher o campo de pacientes
        const patientSelect = document.getElementById('paciente');
        patients.forEach(paciente => {
            const option = document.createElement('option');
            option.value = paciente.idpaciente;
            option.textContent = paciente.nome;
            patientSelect.appendChild(option);
        });

        // Carregar profissionais
        let { data: professionals, error: professionalError } = await supabase
        .from('profissionais')
        .select('idprofissional,nome')
        .order('nome', { ascending: true });
        
        if (professionalError) {
            console.error('Erro ao carregar profissionais:', professionalError);
            return;
        }

        // Preencher o campo de profissionais
        const professionalSelect = document.getElementById('profissional');
        professionals.forEach(profissional => {
            const option = document.createElement('option');
            option.value = profissional.idprofissional;
            option.textContent = profissional.nome;
            professionalSelect.appendChild(option);
        });

        // Carregar salas
        const { data: rooms, error: roomError } = await supabase
            .from('salas')
            .select('idsala, numsala');
        
        if (roomError) {
            console.error('Erro ao carregar salas:', roomError);
            return;
        }

        // Preencher o campo de salas
        const roomSelect = document.getElementById('sala');
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.idsala;
            option.textContent = room.numsala;
            roomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro geral ao carregar opções:', error);
    }
}

// //TODO: FILTRAR POR DATA E HORA
// const getAvailableTime = (idProfissional, weekDay, hour) => {
//     // const dataSemana = getWeekDay(weekDay);
//     const dataSemanaMock = 2;
//     // checar: tab dsponibilidadeProf

//     // pegar horarios de atendimento
//     const { data, error } = await supabase
//         .from('disponibilidadeprof')
//         .select('*')
//         .eq('idprofissional', idProfissional)
//         .eq('diasemana', dataSemanaMock);

//     // pegar atendimentos do dia
//     // filtrar as disponibilidades
// }

// const getAvailableRoom() {
//     // precisa do id do prof, data
//     // checar: 
// }

export async function saveAppointment() {
    const appointmentData = {
        idpaciente: document.getElementById('paciente').value,
        idprofissional: document.getElementById('profissional').value,
        dataconsulta: document.getElementById('data').value,
        horaconsulta: document.getElementById('hora').value + ":00",
        idsala: document.getElementById('sala').value
    };

    console.log(appointmentData);
    try {
        // Inserir o novo agendamento na tabela
        const { data, error } = await supabase
            .from('atendimentos')
            .insert([appointmentData]);

        if (error) {
            console.error('Erro ao agendar:', error);
            alert('Erro ao agendar. Veja o console para mais detalhes.');
            return;
        }

        console.log('Agendamento criado com sucesso:', data);
        alert('Agendamento criado com sucesso!');
        // Limpar o formulário após o sucesso
        document.getElementById('agendamento-form').reset();
    } catch (error) {
        console.error('Erro geral ao salvar agendamento:', error);
    }
}

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses são baseados em 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const setTimeLimits = () => {
    const timeInput = document.getElementById('hora');
    timeInput.setAttribute('min', '08:00'); // Define hora mínima
    timeInput.setAttribute('max', '19:00'); // Define hora máxima
};

document.addEventListener('DOMContentLoaded', () => {
    loadOptions();
    const dateInput = document.getElementById('data');
    dateInput.min = getTodayDate();
    setTimeLimits(); // Define os limites de hora
});

window.agendar = {
    saveAppointment: saveAppointment
}


// Carregar opções quando a página carrega
// window.onload = loadOptions;
// window.saveAppointment = saveAppointment;
