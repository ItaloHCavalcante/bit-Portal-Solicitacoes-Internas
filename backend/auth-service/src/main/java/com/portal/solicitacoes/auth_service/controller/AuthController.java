package br.com.bitsolucoes.auth.controller;

import br.com.bitsolucoes.auth.dto.AuthResponseDTO;
import br.com.bitsolucoes.auth.dto.LoginRequestDTO;
import br.com.bitsolucoes.auth.dto.RegisterRequestDTO;
import br.com.bitsolucoes.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/cadastro")
    public ResponseEntity<AuthResponseDTO> registrar(@RequestBody @Valid RegisterRequestDTO dto) {
        return ResponseEntity.ok(authService.registrar(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }
}