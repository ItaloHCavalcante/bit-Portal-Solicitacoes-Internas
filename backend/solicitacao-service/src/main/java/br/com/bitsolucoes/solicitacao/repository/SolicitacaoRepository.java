package br.com.bitsolucoes.solicitacao.repository;

import br.com.bitsolucoes.solicitacao.model.Solicitacao;
import br.com.bitsolucoes.solicitacao.model.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long>, JpaSpecificationExecutor<Solicitacao> {

    List<Solicitacao> findAllBySolicitanteNome(String solicitanteNome);
    long countByStatus(StatusSolicitacao status);

    @Query("""
        SELECT s FROM Solicitacao s 
        WHERE (:id IS NOT NULL AND s.id = :id) 
           OR LOWER(s.titulo) LIKE LOWER(CONCAT('%', :termo, '%'))
           OR LOWER(s.solicitanteNome) LIKE LOWER(CONCAT('%', :termo, '%'))
    """)
    List<Solicitacao> buscarPorIdOuTermo(@Param("id") Long id, @Param("termo") String termo);
}