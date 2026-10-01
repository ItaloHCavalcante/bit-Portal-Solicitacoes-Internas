package br.com.bitsolucoes.auth.dto;

public record AuthResponseDTO(
        String token,
        String tipo,
        String nome,
        String email,
        String role
) {
    public AuthResponseDTO(String token, String nome, String email, String role) {
        this(token, "Bearer", nome, email, role);
    }
}