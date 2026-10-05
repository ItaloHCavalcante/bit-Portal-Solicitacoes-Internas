package br.com.bitsolucoes.solicitacao.dto;

import br.com.bitsolucoes.solicitacao.model.Categoria;
import br.com.bitsolucoes.solicitacao.model.StatusSolicitacao;

import java.time.LocalDateTime;

public record SolicitacaoResponseDTO(
        Long id,
        String titulo,
        String descricao,
        Categoria categoria,
        StatusSolicitacao status,
        String solicitanteNome,
        LocalDateTime dataCriacao,
        //Operador
        String respostaOperador
) {}