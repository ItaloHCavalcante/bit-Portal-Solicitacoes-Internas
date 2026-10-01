package br.com.bitsolucoes.solicitacao.dto;

import br.com.bitsolucoes.solicitacao.model.Categoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SolicitacaoRequestDTO(
        @NotBlank(message = "O título é obrigatório")
        String titulo,

        @NotBlank(message = "A descrição é obrigatória")
        String descricao,

        @NotNull(message = "A categoria é obrigatória")
        Categoria categoria
) {}