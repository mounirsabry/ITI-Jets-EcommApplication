package jets.projects.utils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public class GetUserID {

    public static Long id = new Long(1);

    public static Long getUserId(HttpServletRequest request) {

        System.out.println(id);

        return id;
    }
}
