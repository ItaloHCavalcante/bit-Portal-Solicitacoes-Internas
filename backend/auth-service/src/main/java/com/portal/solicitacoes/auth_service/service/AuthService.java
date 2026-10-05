package br.com.bitsolucoes.auth.service;

import br.com.bitsolucoes.auth.dto.AuthResponseDTO;
import br.com.bitsolucoes.auth.dto.LoginRequestDTO;
import br.com.bitsolucoes.auth.dto.RegisterRequestDTO;
import br.com.bitsolucoes.auth.exception.EmailAlreadyExistsException;
import br.com.bitsolucoes.auth.exception.InvalidCredentialsException;
import br.com.bitsolucoes.auth.model.Usuario;
import br.com.bitsolucoes.auth.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponseDTO registrar(RegisterRequestDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Este e-mail já está cadastrado.");
        }

        Usuario usuario = Usuario.builder()
                .nome(dto.nome())
                .email(dto.email())
                .senha(passwordEncoder.encode(dto.senha()))
                .role(dto.role())
                .build();

        usuarioRepository.save(usuario);

        String token = jwtService.gerarToken(usuario);

        return new AuthResponseDTO(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole().name()
        );
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new InvalidCredentialsException("E-mail ou senha incorretos."));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new InvalidCredentialsException("E-mail ou senha incorretos.");
        }

        String token = jwtService.gerarToken(usuario);

        return new AuthResponseDTO(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole().name()
        );
    }
}