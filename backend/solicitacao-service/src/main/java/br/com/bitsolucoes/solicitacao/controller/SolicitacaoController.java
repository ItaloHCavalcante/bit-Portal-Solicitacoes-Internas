package br.com.bitsolucoes.solicitacao.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import br.com.bitsolucoes.solicitacao.dto.SolicitacaoRequestDTO;
import br.com.bitsolucoes.solicitacao.dto.SolicitacaoResponseDTO;
import br.com.bitsolucoes.solicitacao.service.SolicitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService service;

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criar(
            @RequestBody @Valid SolicitacaoRequestDTO dto,
            Authentication authentication) {

        return ResponseEntity.ok(service.criar(dto, authentication));
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarMinhas(Authentication authentication) {
        return ResponseEntity.ok(service.listarMinhas(authentication));
    }

    @GetMapping("/gestor/buscar")
    @PreAuthorize("hasRole('GESTOR')")
    public ResponseEntity<List<SolicitacaoResponseDTO>> buscar(
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(service.buscarGenerica(q));

    }
}