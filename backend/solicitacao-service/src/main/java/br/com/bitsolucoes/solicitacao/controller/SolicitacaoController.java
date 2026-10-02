package br.com.bitsolucoes.solicitacao.controller;

import br.com.bitsolucoes.solicitacao.dto.MetricasDTO;
import br.com.bitsolucoes.solicitacao.dto.SolicitacaoRequestDTO;
import br.com.bitsolucoes.solicitacao.dto.SolicitacaoResponseDTO;
import br.com.bitsolucoes.solicitacao.model.Categoria;
import br.com.bitsolucoes.solicitacao.model.StatusSolicitacao;
import br.com.bitsolucoes.solicitacao.service.SolicitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto, authentication));
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

    @GetMapping("/operador/buscar")
    @PreAuthorize("hasRole('OPERADOR')")
    public ResponseEntity<List<SolicitacaoResponseDTO>> buscar(
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(service.buscarGenerica(q));
    }

    //Permite o solicitante editar a SOLICITAÇÃO apenas se estiver em ABERTO
    @PutMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> editar(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoRequestDTO dto,
            Authentication authentication) {
        return ResponseEntity.ok(service.editar(id, dto, authentication));
    }

    //O Solicitante pode fazer a EXCLUSÃO apenas se o Status tiver em "ABERTO"
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(
            @PathVariable Long id,
            Authentication authentication) {
        service.excluir(id, authentication);
        return ResponseEntity.noContent().build();
    }

    //Apenas o Operador pode mudar o STATUS da SOLICITAÇÃO
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OPERADOR')")
    public ResponseEntity<SolicitacaoResponseDTO> alterarStatus(
            @PathVariable Long id,
            @RequestParam StatusSolicitacao novoStatus) {
        return ResponseEntity.ok(service.alterarStatus(id, novoStatus));
    }

    //Método para FILTRAR solicitações por: DATA (inicio e fim), CATEGORIA, STATUS ou TÍTULO
    @GetMapping("/filtrar")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> filtrar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @RequestParam(required = false) Categoria categoria,
            @RequestParam(required = false) StatusSolicitacao status,
            @RequestParam(required = false) String texto,
            @PageableDefault(size = 10, sort = "dataCriacao", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<SolicitacaoResponseDTO> resultado = service.listarComFiltros(
                dataInicio, dataFim, categoria, status, texto, pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/metricas")
    public ResponseEntity<MetricasDTO> obterMetricas() {
        return ResponseEntity.ok(service.obterMetricas());
    }
}