package jets.projects.dao;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.TypedQuery;
import jets.projects.entity.Book;
import jets.projects.utils.JpaUtil;

public class BookDao {

    private final EntityManagerFactory emf;

    public BookDao() {
        this.emf = JpaUtil.getEntityManagerFactory();
    }

    public Optional<Book> findById(Long bookId) {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery(
                    "SELECT b FROM Book b LEFT JOIN FETCH b.images WHERE b.bookId = :bookId", Book.class);
            query.setParameter("bookId", bookId);
            List<Book> results = query.getResultList();
            return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
        } finally {
            em.close();
        }
    }

    public List<Book> findAll() {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery(
                    "SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.images", Book.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Book> findTopSellingBooks(int limit) {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery(
                            "SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.images ORDER BY b.soldCount DESC", Book.class)
                    .setMaxResults(limit);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Book> findTopSellingBooksByGenre() {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery(
                    "SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.images "
                            + "WHERE b.soldCount = ("
                            + "SELECT MAX(b2.soldCount) FROM Book b2 WHERE b2.genre = b.genre"
                            + ")",
                    Book.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Book> searchByKeyword(String keyword) {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery(
                            "SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.images "
                                    + "WHERE LOWER(b.title) LIKE :keyword OR LOWER(b.author) LIKE :keyword OR LOWER(b.isbn) LIKE :keyword",
                            Book.class)
                    .setParameter("keyword", "%" + keyword.toLowerCase() + "%");
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public void update(Book book) {
        EntityManager em = emf.createEntityManager();
        try {
            em.getTransaction().begin();
            em.merge(book);
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