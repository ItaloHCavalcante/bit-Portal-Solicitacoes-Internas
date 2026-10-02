package br.com.bitsolucoes.solicitacao.service;

import br.com.bitsolucoes.solicitacao.dto.MetricasDTO;
import br.com.bitsolucoes.solicitacao.dto.SolicitacaoRequestDTO;
import br.com.bitsolucoes.solicitacao.dto.SolicitacaoResponseDTO;
import br.com.bitsolucoes.solicitacao.model.Categoria;
import br.com.bitsolucoes.solicitacao.model.Solicitacao;
import br.com.bitsolucoes.solicitacao.model.StatusSolicitacao;
import br.com.bitsolucoes.solicitacao.repository.SolicitacaoRepository;
import br.com.bitsolucoes.solicitacao.repository.SolicitacaoSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitacaoService {

    private final SolicitacaoRepository repository;

    @Transactional
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

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarTodas() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO buscarPorId(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));
    }

    // AJUSTE: Implementado para filtrar as solicitações do usuário logado
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarMinhas(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return List.of();
        }
        String nomeUsuario = auth.getName();
        return repository.findAllBySolicitanteNome(nomeUsuario)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarEmAndamentoOperador() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> buscarGenerica(String query) {
        if (query == null || query.isBlank()) {
            return listarEmAndamentoOperador();
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

    //Editar solicitação (Apenas status ABERTO e mesmo solicitante)
    @Transactional
    public SolicitacaoResponseDTO editar(Long id, SolicitacaoRequestDTO dto, Authentication auth) {
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada com ID: " + id));

        validarProprietarioEStatusAberto(solicitacao, auth, "editar");

        solicitacao.setTitulo(dto.titulo());
        solicitacao.setDescricao(dto.descricao());
        solicitacao.setCategoria(dto.categoria());

        Solicitacao atualizada = repository.save(solicitacao);
        return toDTO(atualizada);
    }

    //Excluir solicitação (Apenas status ABERTO e mesmo solicitante)
    @Transactional
    public void excluir(Long id, Authentication auth) {
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada com ID: " + id));

        validarProprietarioEStatusAberto(solicitacao, auth, "excluir");

        repository.delete(solicitacao);
    }

    //Alterar status da solicitação
    @Transactional
    public SolicitacaoResponseDTO alterarStatus(Long id, StatusSolicitacao novoStatus) {
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada com ID: " + id));

        solicitacao.setStatus(novoStatus);
        Solicitacao atualizada = repository.save(solicitacao);
        return toDTO(atualizada);
    }

    //Filtro com Paginador (Datas, Categoria, Status, Título)
    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> listarComFiltros(
            LocalDateTime dataInicio,
            LocalDateTime dataFim,
            Categoria categoria,
            StatusSolicitacao status,
            String texto,
            Pageable pageable) {

        Specification<Solicitacao> spec = SolicitacaoSpecification.comFiltros(dataInicio, dataFim, categoria, status, texto);
        return repository.findAll(spec, pageable).map(this::toDTO);
    }

    //Métricas pra o dashboard
    @Transactional(readOnly = true)
    public MetricasDTO obterMetricas() {
        long total = repository.count();
        long abertas = repository.countByStatus(StatusSolicitacao.ABERTO);
        long emAtendimento = repository.countByStatus(StatusSolicitacao.EM_ATENDIMENTO);
        long concluidas = repository.countByStatus(StatusSolicitacao.CONCLUIDO);

        return new MetricasDTO(total, abertas, emAtendimento, concluidas);
    }

    //Método auxiliar (Validação das Regras de Negócio)
    private void validarProprietarioEStatusAberto(Solicitacao solicitacao, Authentication auth, String acao) {
        if (solicitacao.getStatus() != StatusSolicitacao.ABERTO) {
            throw new IllegalStateException("Apenas solicitações com status 'ABERTO' podem ser " + acao + "s.");
        }

        if (auth != null && auth.isAuthenticated()) {
            String usuarioLogado = auth.getName();
            if (!usuarioLogado.equals(solicitacao.getSolicitanteNome())) {
                throw new SecurityException("Apenas o criador da solicitação tem permissão para " + acao + ".");
            }
        }
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