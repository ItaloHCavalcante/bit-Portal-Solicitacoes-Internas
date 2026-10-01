package br.com.bitsolucoes.solicitacao.service;

import br.com.bitsolucoes.solicitacao.dto.SolicitacaoRequestDTO;
import br.com.bitsolucoes.solicitacao.dto.SolicitacaoResponseDTO;
import br.com.bitsolucoes.solicitacao.model.Solicitacao;
import br.com.bitsolucoes.solicitacao.model.StatusSolicitacao;
import br.com.bitsolucoes.solicitacao.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository repository;

    public SolicitacaoResponseDTO criar(SolicitacaoRequestDTO dto, Authentication auth) {
        Solicitacao solicitacao = new Solicitacao();

        solicitacao.setTitulo(dto.titulo());
        solicitacao.setDescricao(dto.descricao());
        solicitacao.setCategoria(dto.categoria());

        solicitacao.setStatus(StatusSolicitacao.ABERTO);
        solicitacao.setDataCriacao(LocalDateTime.now());

        if (auth != null && auth.isAuthenticated()) {
            solicitacao.setSolicitanteNome(auth.getName());
        }

        Solicitacao salva = repository.save(solicitacao);
        return toDTO(salva);
    }

    public List<SolicitacaoResponseDTO> listarTodas() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public SolicitacaoResponseDTO buscarPorId(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));
    }

    public List<SolicitacaoResponseDTO> listarMinhas(Authentication auth) {
        return List.of();
    }

    public List<SolicitacaoResponseDTO> listarEmAndamentoGestor() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public List<SolicitacaoResponseDTO> buscarGenerica(String query) {
        if (query == null || query.isBlank()) {
            return listarEmAndamentoGestor();
        }

        String termoTratado = query.trim();
        Long idBusca = null;

        if (termoTratado.matches("\\d+")) {
            try {
                idBusca = Long.parseLong(termoTratado);
            } catch (NumberFormatException ignored) {}
        }

        return repository.buscarPorIdOuTermo(idBusca, termoTratado)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private SolicitacaoResponseDTO toDTO(Solicitacao s) {
        return new SolicitacaoResponseDTO(
                s.getId(),
                s.getTitulo(),
                s.getDescricao(),
                s.getCategoria(),
                s.getStatus(),
                s.getSolicitanteNome(),
                s.getDataCriacao()
        );
    }
}