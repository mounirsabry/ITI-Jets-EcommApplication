package jets.projects.admin_user;

import java.util.HashSet;
import java.util.Set;

import com.google.gson.Gson;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import jets.projects.beans.BookBean;

@ServerEndpoint("/Admin/EditBook")
public class AdminEditBookServer {

    private static Set<Session> sessions = new HashSet<>();

    @OnOpen
    public void onOpen(Session session) {

        System.out.println(session.getId() + " has opened a connection in admin edit book server");
        sessions.add(session);
        System.out.println("size" + sessions.size());

    }

    @OnMessage
    public void onMessage(String message, Session session) {

        Gson gson = new Gson();

        System.out.println("addbook in socket " + message);

        //System.out.println("addbook in socket " + gson.toJson(message));
        BookBean newBook = gson.fromJson(message, BookBean.class);

        // AdminBooks.addBook(newBook);
        AdminBooks.editBookById(newBook.getId(), newBook);

        for (Session userSession : sessions) {
            sendBooks(userSession);
        }

    }

    @OnClose
    public void onClose(Session ses) {

        System.out.println("session closed");
        sessions.remove(ses);

    }

    public void sendBooks(Session session) {

        Gson users = new Gson();
        String Books = users.toJson(AdminBooks.books);
        System.out.println("new books-----");
        System.out.println(Books);
        try {
            session.getBasicRemote().sendText(Books);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }
}
