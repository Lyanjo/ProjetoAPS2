import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js";

// Configuração do Supabase
const supabaseUrl = "https://jzijhoertjzjurmghbzr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aWpob2VydGp6anVybWdoYnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NTg4ODMsImV4cCI6MjA0MTAzNDg4M30.A6MMeZO3kkzYHRJUxka1q3L7owb60BqIBxe5TBHQKPc";
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadOptions() {
  try {
    // Carregar pacientes
    const { data: patients, error: patientError } = await supabase
      .from("pacientes")
      .select("idpaciente, nome")
      .order("nome", { ascending: true });

    if (patientError) {
      console.error("Erro ao carregar pacientes:", patientError);
      return;
    }

    // Limpar o campo de pacientes antes de adicionar novos
    const patientSelect = document.getElementById("paciente");
    patientSelect.innerHTML = '<option value="">Selecione o Paciente</option>'; // Limpar opções existentes
    patients.forEach((paciente) => {
      const option = document.createElement("option");
      option.value = paciente.idpaciente;
      option.textContent = paciente.nome;
      patientSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Erro geral ao carregar opções:", error);
  }
}

async function loadRoomsAndProfessionals(dataConsulta, horaConsulta) {
  try {
    // Carregar salas disponíveis
    const { data: rooms, error: roomError } = await supabase
      .from("salas")
      .select("idsala, numsala");

    if (roomError) {
      console.error("Erro ao carregar salas:", roomError);
      return;
    }

    // Verificar quais salas estão ocupadas no horário escolhido
    const { data: occupiedRooms } = await supabase
      .from("atendimentos")
      .select("idsala")
      .eq("dataconsulta", dataConsulta)
      .eq("horaconsulta", horaConsulta);

    const occupiedRoomIds = occupiedRooms.map((room) => room.idsala);

    // Verificar se todas as salas estão ocupadas para o horário específico
    const allRoomsOccupied =
      rooms.length > 0 &&
      rooms.every((room) => occupiedRoomIds.includes(room.idsala));

    // Se todas as salas estiverem ocupadas, desabilitar o horário
    const timeInput = document.getElementById("hora");
    const optionToDisable = [...timeInput.options].find(
      (option) => option.value === horaConsulta.slice(0, 5)
    );

    if (allRoomsOccupied && optionToDisable) {
      optionToDisable.disabled = true;
    } else if (!allRoomsOccupied && optionToDisable) {
      optionToDisable.disabled = false; // Habilita caso haja disponibilidade
    }

    // Preencher o campo de salas com base na disponibilidade
    const roomSelect = document.getElementById("sala");
    roomSelect.innerHTML = '<option value="">Selecione a Sala</option>';
    rooms.forEach((room) => {
      const option = document.createElement("option");
      option.value = room.idsala;
      option.textContent = room.numsala;
      option.disabled = occupiedRoomIds.includes(room.idsala);
      roomSelect.appendChild(option);
    });

    // Carregar profissionais disponíveis
    const { data: professionals, error: professionalError } = await supabase
      .from("profissionais")
      .select("idprofissional, nome")
      .order("nome", { ascending: true });

    if (professionalError) {
      console.error("Erro ao carregar profissionais:", professionalError);
      return;
    }

    // Verificar quais profissionais estão ocupados no horário escolhido
    const { data: occupiedProfessionals } = await supabase
      .from("atendimentos")
      .select("idprofissional")
      .eq("dataconsulta", dataConsulta)
      .eq("horaconsulta", horaConsulta);

    const occupiedProfessionalIds = occupiedProfessionals.map(
      (prof) => prof.idprofissional
    );

    // Preencher o campo de profissionais com base na disponibilidade
    const professionalSelect = document.getElementById("profissional");
    professionalSelect.innerHTML =
      '<option value="">Selecione o Profissional</option>';
    professionals.forEach((prof) => {
      const option = document.createElement("option");
      option.value = prof.idprofissional;
      option.textContent = prof.nome;
      option.disabled = occupiedProfessionalIds.includes(prof.idprofissional);
      professionalSelect.appendChild(option);
    });

    // Habilitar o campo de profissionais após a seleção de data e hora
    document.getElementById("profissional").disabled = false;
  } catch (error) {
    console.error("Erro geral ao carregar salas e profissionais:", error);
  }
}

export async function saveAppointment() {
  const appointmentData = {
    idpaciente: document.getElementById("paciente").value,
    idprofissional: document.getElementById("profissional").value,
    dataconsulta: document.getElementById("data").value,
    horaconsulta: document.getElementById("hora").value + ":00",
    idsala: document.getElementById("sala").value,
  };

  console.log(appointmentData);
  try {
    // Inserir o novo agendamento na tabela
    const { data, error } = await supabase
      .from("atendimentos")
      .insert([appointmentData]);

    if (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro ao agendar. Veja o console para mais detalhes.");
      return;
    }

    console.log("Agendamento criado com sucesso:", data);
    alert("Agendamento criado com sucesso!");
    // Limpar o formulário após o sucesso
    document.getElementById("agendamento-form").reset();
  } catch (error) {
    console.error("Erro geral ao salvar agendamento:", error);
  }
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses são baseados em 0
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const setTimeLimits = () => {
  const timeInput = document.getElementById("hora");
  timeInput.setAttribute("min", "08:00"); // Define hora mínima
  timeInput.setAttribute("max", "19:00"); // Define hora máxima
};

// Limpar campos ao alterar a data
document.getElementById("data").addEventListener("change", () => {
  const dataConsulta = document.getElementById("data").value;
  const horaConsulta = document.getElementById("hora");

  // Limpar os campos de hora e sala
  horaConsulta.selectedIndex = 0; // Reseta a seleção de hora
  document.getElementById("sala").innerHTML =
    '<option value="">Selecione a Sala</option>'; // Limpa as opções de sala

  if (dataConsulta) {
    loadRoomsAndProfessionals(dataConsulta, horaConsulta.value + ":00");
  }
});

document.getElementById("hora").addEventListener("change", () => {
  const dataConsulta = document.getElementById("data").value;
  const horaConsulta = document.getElementById("hora").value;

  if (dataConsulta && horaConsulta) {
    loadRoomsAndProfessionals(dataConsulta, horaConsulta + ":00");
  }
});

loadOptions();
document.addEventListener("DOMContentLoaded", () => {
  loadOptions();
  const dateInput = document.getElementById("data");
  dateInput.min = getTodayDate();
  setTimeLimits(); // Define os limites de hora
});

window.agendar = {
  saveAppointment: saveAppointment,
};
