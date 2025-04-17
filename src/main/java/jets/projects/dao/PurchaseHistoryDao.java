package jets.projects.dao;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.TypedQuery;
import jets.projects.entity.PurchaseHistory;
import jets.projects.utils.JpaUtil;

public class PurchaseHistoryDao {

    private final EntityManagerFactory emf;

    public PurchaseHistoryDao() {
        this.emf = JpaUtil.getEntityManagerFactory();
    }

    // Find all purchase history items by user ID
    public List<PurchaseHistory> findByUserId(Long userId) {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<PurchaseHistory> query = em.createQuery(
                    "SELECT p FROM PurchaseHistory p WHERE p.user.userId = :userId",
                    PurchaseHistory.class
            );
            query.setParameter("userId", userId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    // Find specific purchase history item by user ID and item ID
    public Optional<PurchaseHistory> findByUserIdAndItemId(Long userId, Long itemId) {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<PurchaseHistory> query = em.createQuery(
                    "SELECT p FROM PurchaseHistory p WHERE p.user.userId = :userId AND p.receiptId = :itemId",
                    PurchaseHistory.class
            );
            query.setParameter("userId", userId);
            query.setParameter("itemId", itemId);
            List<PurchaseHistory> results = query.getResultList();
            return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
        } finally {
            em.close();
        }
    }

    public void save(PurchaseHistory purchase) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(purchase);
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            throw e;
        } finally {
            em.close();
        }
    }
}
