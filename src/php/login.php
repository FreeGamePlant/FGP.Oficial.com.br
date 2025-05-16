<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Aqui você pode adicionar lógica para verificar o login no banco de dados
    if ($username === 'admin' && $password === '1234') {
        echo "Login bem-sucedido!";
    } else {
        echo "Usuário ou senha inválidos.";
    }
}
?>