package jets.projects.admin_user;

import java.util.HashSet;
import java.util.Set;

import com.google.gson.Gson;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint("/Admin/ViewUsers")
public class AdminViewUsersServer {

    private static Set<Session> sessions = new HashSet<>();

    @OnOpen
    public void onOpen(Session session) {

        System.out.println(session.getId() + " has opened a connection");
        sessions.add(session);

        sendUsers(session);

    }

    @OnMessage
    public void onMessage(String message, Session session) {

    }

    @OnClose
    public void onClose(Session ses) {

        System.out.println("session closed");
        sessions.remove(ses);
    }

    public void sendUsers(Session session) {

        Gson users = new Gson();
        String usersData = users.toJson(AdminUsers.users);

        System.out.println("view ---------");
        System.out.println(usersData);

        try {
            session.getBasicRemote().sendText(usersData);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

    }
}
