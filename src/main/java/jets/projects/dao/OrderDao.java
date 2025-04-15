package jets.projects.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.TypedQuery;
import jets.projects.entity.BookOrder;
import jets.projects.utils.JpaUtil;

import java.util.List;
import java.util.Optional;

public class OrderDao {
    private final EntityManagerFactory emf;

    public OrderDao() {
        this.emf = JpaUtil.getEntityManagerFactory();
    }

    public List<BookOrder> findByUserId(Long userId) {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<BookOrder> query = em.createQuery(
                    "SELECT DISTINCT o FROM BookOrder o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.book WHERE o.user.userId = :userId",
                    BookOrder.class
            );
            query.setParameter("userId", userId);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public Optional<BookOrder> findByUserIdAndOrderId(Long userId, Long orderId) {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<BookOrder> query = em.createQuery(
                    "SELECT o FROM BookOrder o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.book WHERE o.user.userId = :userId AND o.orderId = :orderId",
                    BookOrder.class
            );
            query.setParameter("userId", userId);
            query.setParameter("orderId", orderId);
            List<BookOrder> results = query.getResultList();
            return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
        } finally {
            em.close();
        }
    }

    public void save(BookOrder order) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.persist(order);
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