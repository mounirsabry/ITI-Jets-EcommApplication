package jets.projects.admin_user;

import com.google.gson.Gson;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import jets.projects.beans.BookBean;
import jets.projects.client_dto.BookDto;
import jets.projects.services.BookService;
import jets.projects.utils.MapperUtil;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static jets.projects.utils.MapperUtil.convertToBookDto;

@ServerEndpoint("/Admin/AddBook")
public class AdminAddBookServer {

    private static Set<Session> sessions = new HashSet<>();
    private final BookService bookService;

    public AdminAddBookServer() {
        this.bookService = new BookService();
    }


    @OnOpen
    public void onOpen(Session session) {
        System.out.println(session.getId() + " has opened a connection in admin add book server");
        sessions.add(session);
        System.out.println("size" + sessions.size());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        Gson gson = new Gson();
        System.out.println("addbook in socket " + message);
        try {
            BookBean newBook = gson.fromJson(message, BookBean.class);
            BookDto bookDto = convertToBookDto(newBook);
            bookService.addBook(bookDto);
            for (Session userSession : sessions) {
                sendBooks(userSession);
            }
        } catch (Exception e) {
            System.out.println("Error adding book: " + e.getMessage());
        }
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("session closed");
        sessions.remove(session);
    }

    public void sendBooks(Session session) {
        Gson gson = new Gson();
        try {
            List<BookDto> bookDtos = bookService.getAllBooks();
            List<BookBean> bookBeans = bookDtos.stream()
                    .map(MapperUtil::convertToBookBean)
                    .collect(Collectors.toList());
            String booksJson = gson.toJson(bookBeans);
            System.out.println("new books-----");
            System.out.println(booksJson);
            session.getBasicRemote().sendText(booksJson);
        } catch (Exception e) {
            System.out.println("Error sending books: " + e.getMessage());
        }
    }
}