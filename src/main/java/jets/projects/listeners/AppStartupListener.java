package jets.projects.listeners;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

import com.mysql.cj.jdbc.AbandonedConnectionCleanupThread;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jets.projects.db_connection.ConnectionManager;

public class AppStartupListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent event) {
        boolean isInit = ConnectionManager.initDeviceManager();
        if (!isInit) {
            System.err.println("Failed to connect to DB.");
            throw new RuntimeException(" Application will not start.");
        }
    }

    @Override
    @SuppressWarnings("CallToPrintStackTrace")
    public void contextDestroyed(ServletContextEvent sce) {
        // Explicitly deregister MySQL driver
        try {
            AbandonedConnectionCleanupThread.checkedShutdown();
            // Alternative approach if the above doesn't work
            // com.mysql.cj.jdbc.Driver.unloadDriver();

            // Deregister JDBC drivers
            Enumeration<Driver> drivers = DriverManager.getDrivers();
            while (drivers.hasMoreElements()) {
                Driver driver = drivers.nextElement();
                try {
                    DriverManager.deregisterDriver(driver);
                    System.out.println("Deregistered JDBC driver: " + driver);
                } catch (SQLException ex) {
                    System.err.println("Error deregistering JDBC driver: " + driver);
                    ex.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("Error shutting down MySQL cleanup thread");
            e.printStackTrace();
        }
    }
}
