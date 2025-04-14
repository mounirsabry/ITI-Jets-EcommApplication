package jets.projects.admin_user;

import java.util.HashSet;
import java.util.Set;

import com.google.gson.Gson;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint("/Admin/ViewBooks")
public class AdminViewBooksServer {

    private static Set<Session> sessions = new HashSet<>();

    @OnOpen
    public void onOpen(Session session) {

        System.out.println(session.getId() + " has opened a connection in view book server");
        sessions.add(session);
        System.out.println("size" + sessions.size());

        sendBooks(session);

    }

    @OnMessage
    public void onMessage(String message, Session session) {

    }

    @OnClose
    public void onClose(Session ses) {

        System.out.println("session closed");
        sessions.remove(ses);
    }

    public void sendBooks(Session session) {

        Gson users = new Gson();
        String Books = users.toJson(AdminBooks.books);
        System.out.println("view ---------");
        System.out.println(Books);
        try {
            session.getBasicRemote().sendText(Books);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }
}
