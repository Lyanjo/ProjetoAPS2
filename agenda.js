import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://jzijhoertjzjurmghbzr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aWpob2VydGp6anVybWdoYnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NTg4ODMsImV4cCI6MjA0MTAzNDg4M30.A6MMeZO3kkzYHRJUxka1q3L7owb60BqIBxe5TBHQKPc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadSchedule() {
    try {
        // Carregar pacientes
        const { data: appointments, error: appointmentsError } = await supabase
        .from('atendimentos')
        .select(`
            dataconsulta,
            horaconsulta,
            salas (numsala),
            pacientes (nome),
            profissionais (nome)
        `)
        .eq("dataconsulta", getTodayDate())
        .order('horaconsulta', { ascending: true })
        .order('salas (numsala)', { ascending: true });

    if (appointmentsError) {
        console.error('Erro ao carregar agendamentos:', appointmentsError);
    } else {
        console.log('Agendamentos carregados:', appointments);
    }  
    
        const tableBody = document.getElementById('tabela-agenda').getElementsByTagName('tbody')[0];

        appointments.forEach((appointment) => {
            const row = document.createElement('tr');

            // Criar e adicionar as células na linha
            const dataCell = document.createElement('td');
            dataCell.textContent = appointment.dataconsulta;
            row.appendChild(dataCell);

            const horaCell = document.createElement('td');
            horaCell.textContent = appointment.horaconsulta;
            row.appendChild(horaCell);
            
            const salaCell = document.createElement('td');
            salaCell.textContent = appointment.salas ? appointment.salas.numsala : 'N/A';
            row.appendChild(salaCell);

            const pacienteCell = document.createElement('td');
            pacienteCell.textContent = appointment.pacientes ? appointment.pacientes.nome : 'N/A';
            row.appendChild(pacienteCell);

            const profissionalCell = document.createElement('td');
            profissionalCell.textContent = appointment.profissionais ? appointment.profissionais.nome : 'N/A';
            row.appendChild(profissionalCell);



            // Adicionar a linha à tabela
            tableBody.appendChild(row);
        });
    } catch { }
}
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses são baseados em 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

document.addEventListener('DOMContentLoaded', () => {
    loadSchedule();
});

/*
let { data: atendimentos, error } = await supabase
  .from('atendimentos')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
  */