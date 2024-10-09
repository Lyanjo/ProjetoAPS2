import { createClient } from "https://esm.sh/@supabase/supabase-js@1.35.7";

// Configuração do Supabase
const supabaseUrl = "https://jzijhoertjzjurmghbzr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aWpob2VydGp6anVybWdoYnpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NTg4ODMsImV4cCI6MjA0MTAzNDg4M30.A6MMeZO3kkzYHRJUxka1q3L7owb60BqIBxe5TBHQKPc";
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para tentar login
async function tentarLogin(event) {
  event.preventDefault(); // Evita o recarregamento da página ao enviar o formulário

  const usuario = document.getElementById("usuario-login").value;
  const senha = document.getElementById("senha-login").value;

  // Busca o usuário no Supabase
  const { data, error } = await supabase
    .from("login")
    .select("*")
    .eq("usuario", usuario)
    .eq("senha", senha)
    .single();

  if (error || !data) {
    document.getElementById("login-error").style.display = "block"; // Exibe a mensagem de erro
  } else {
    window.location.href = "agenda.html"; // Redireciona para a página principal
  }
}

// Associando a função ao formulário
document.getElementById("form-login").addEventListener("submit", tentarLogin);
