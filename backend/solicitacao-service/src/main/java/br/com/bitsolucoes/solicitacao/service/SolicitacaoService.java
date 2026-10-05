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

    //Criar Solicitação
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

    // Listar todas as Solicitações
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarTodas(Authentication auth) {
        if (isOperador(auth)) {
            return repository.findAll().stream().map(this::toDTO).toList();
        }
        return repository.findAllBySolicitanteNome(auth.getName()).stream().map(this::toDTO).toList();
    }

    // Buscar Solicitação por ID
    @Transactional(readOnly = true)
    public SolicitacaoResponseDTO buscarPorId(Long id, Authentication auth) {
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        //Se não for operador, e o dono for diferente de quem está pedindo = Acesso Negado
        if (!isOperador(auth) && !solicitacao.getSolicitanteNome().equals(auth.getName())) {
            throw new SecurityException("Acesso negado. Você não pode visualizar esta solicitação.");
        }
        return toDTO(solicitacao);
    }

    //Listar Minhas Solicitações
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarMinhas(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return List.of();
        return repository.findAllBySolicitanteNome(auth.getName())
                .stream().map(this::toDTO).toList();
    }

    //Busca Genérica
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> buscarGenerica(String query, Authentication auth) {
        String dono = isOperador(auth) ? null : auth.getName();

        if (query == null || query.isBlank()) {
            return dono == null
                    ? repository.findAll().stream().map(this::toDTO).toList()
                    : repository.findAllBySolicitanteNome(dono).stream().map(this::toDTO).toList();
        }

        String termoTratado = query.trim();
        Long idBusca = null;

        if (termoTratado.matches("\\d+")) {
            try { idBusca = Long.parseLong(termoTratado); } catch (NumberFormatException ignored) {}
        }

        return repository.buscarPorIdOuTermo(idBusca, termoTratado, dono)
                .stream().map(this::toDTO).toList();
    }

    // Editar Solicitação
    @Transactional
    public SolicitacaoResponseDTO editar(Long id, SolicitacaoRequestDTO dto, Authentication auth) {
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        validarProprietarioEStatusAberto(solicitacao, auth, "editar");

        solicitacao.setTitulo(dto.titulo());
        solicitacao.setDescricao(dto.descricao());
        solicitacao.setCategoria(dto.categoria());

        return toDTO(repository.save(solicitacao));
    }

    // Excluir Solicitação
    @Transactional
    public void excluir(Long id, Authentication auth) {
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        validarProprietarioEStatusAberto(solicitacao, auth, "excluir");
        repository.delete(solicitacao);
    }

    // Alterar Status
    @Transactional
    public SolicitacaoResponseDTO alterarStatus(Long id, StatusSolicitacao novoStatus, String resposta) { // <- Adicionar String resposta
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        solicitacao.setStatus(novoStatus);

        if (resposta != null && !resposta.trim().isEmpty()) {
            solicitacao.setRespostaOperador(resposta);
        }

        return toDTO(repository.save(solicitacao));
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> listarComFiltros(
            LocalDateTime dataInicio, LocalDateTime dataFim, Categoria categoria,
            StatusSolicitacao status, String texto, Pageable pageable, Authentication auth) {

        String dono = isOperador(auth) ? null : auth.getName();
        Specification<Solicitacao> spec = SolicitacaoSpecification.comFiltros(dataInicio, dataFim, categoria, status, texto, dono);

        return repository.findAll(spec, pageable).map(this::toDTO);
    }

    // Métricas
    @Transactional(readOnly = true)
    public MetricasDTO obterMetricas(Authentication auth) {
        if (isOperador(auth)) {
            return new MetricasDTO(
                    repository.count(),
                    repository.countByStatus(StatusSolicitacao.ABERTO),
                    repository.countByStatus(StatusSolicitacao.EM_ATENDIMENTO),
                    repository.countByStatus(StatusSolicitacao.CONCLUIDO)
            );
        } else {
            String nome = auth.getName();
            return new MetricasDTO(
                    repository.countBySolicitanteNome(nome),
                    repository.countBySolicitanteNomeAndStatus(nome, StatusSolicitacao.ABERTO),
                    repository.countBySolicitanteNomeAndStatus(nome, StatusSolicitacao.EM_ATENDIMENTO),
                    repository.countBySolicitanteNomeAndStatus(nome, StatusSolicitacao.CONCLUIDO)
            );
        }
    }

    private boolean isOperador(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_OPERADOR"));
    }

    private void validarProprietarioEStatusAberto(Solicitacao solicitacao, Authentication auth, String acao) {
        if (solicitacao.getStatus() != StatusSolicitacao.ABERTO) {
            throw new IllegalStateException("Apenas solicitações com status 'ABERTO' podem ser " + acao + "s.");
        }
        if (auth != null && auth.isAuthenticated()) {
            if (!auth.getName().equals(solicitacao.getSolicitanteNome())) {
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
                s.getDataCriacao(),
                s.getRespostaOperador()
        );
    }
}