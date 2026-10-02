package br.com.bitsolucoes.solicitacao.dto;

public record MetricasDTO(
        long totalSolicitacoes,
        long solicitacoesAbertas,
        long solicitacoesEmAtendimento,
        long solicitacoesConcluidas
) {}