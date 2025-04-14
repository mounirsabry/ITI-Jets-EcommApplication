package jets.projects.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jets.projects.entity.Book;
import jets.projects.utils.JpaUtil;

import java.util.List;
import java.util.Optional;

public class BookDao
{
    private final EntityManagerFactory emf;

    public BookDao() {
        this.emf = JpaUtil.getEntityManagerFactory();
    }

    public Optional<Book> findById(Long bookId)
    {
        EntityManager em = emf.createEntityManager();
        try {
            Book book = em.find(Book.class, bookId);
            return Optional.ofNullable(book);
        } finally {
            em.close();
        }
    }

    public List<Book> findAll()
    {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery("SELECT b FROM Book b", Book.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    // Find top 10 selling books
    public List<Book> findTopSellingBooks(int limit)
    {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery(
                            "SELECT b FROM Book b ORDER BY b.soldCount DESC", Book.class)
                    .setMaxResults(limit);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Book> findTopSellingBooksByGenre()
    {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery(
                    "SELECT b FROM Book b WHERE b.soldCount = (SELECT MAX(b2.soldCount) FROM Book b2 WHERE b2.genre = b.genre)",
                    Book.class);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    public List<Book> searchByKeyword(String keyword)
    {
        EntityManager em = emf.createEntityManager();
        try {
            TypedQuery<Book> query = em.createQuery(
                            "SELECT b FROM Book b WHERE LOWER(b.title) LIKE :keyword OR LOWER(b.author) LIKE :keyword OR LOWER(b.isbn) LIKE :keyword",
                            Book.class)
                    .setParameter("keyword", "%" + keyword.toLowerCase() + "%");
            return query.getResultList();
        } finally {
            em.close();
        }
    }
}