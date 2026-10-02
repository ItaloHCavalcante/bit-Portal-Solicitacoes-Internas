package br.com.bitsolucoes.solicitacao.repository;

import br.com.bitsolucoes.solicitacao.model.Categoria;
import br.com.bitsolucoes.solicitacao.model.Solicitacao;
import br.com.bitsolucoes.solicitacao.model.StatusSolicitacao;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class SolicitacaoSpecification {

    public static Specification<Solicitacao> comFiltros(
            LocalDateTime dataInicio,
            LocalDateTime dataFim,
            Categoria categoria,
            StatusSolicitacao status,
            String texto) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (dataInicio != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("dataCriacao"), dataInicio));
            }

            if (dataFim != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("dataCriacao"), dataFim));
            }

            if (categoria != null) {
                predicates.add(criteriaBuilder.equal(root.get("categoria"), categoria));
            }

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (texto != null && !texto.trim().isEmpty()) {
                String pattern = "%" + texto.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), pattern));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}