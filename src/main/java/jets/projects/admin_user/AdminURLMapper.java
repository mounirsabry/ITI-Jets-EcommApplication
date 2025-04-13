package jets.projects.admin_user;

public class AdminURLMapper {

    public static final String ERROR_PAGE = "/Error/error_page.jspx";

    public static final String HOME = "/Admin/Home";
    public static final String HOME_SERVLET = "AdminDirector";

    public static final String LOGIN = "/Admin/Login";
    public static final String LOGIN_SERVLET = "AdminLogin";

    public static final String LOGOUT = "/Admin/Logout";
    public static final String LOGOUT_SERVLET = "AdminLogout";

    public static final String USERS = "/Admin/AdminUsers";

    public static final String SEARCH = "/Admin/AdminSearchProducts";
    public static final String SEARCH_SERVLET = "AdminSearchProducts";

    public static final String LOGIN_PAGE = "/Admin/admin_login.jsp";
    public static final String HOME_PAGE = "/Admin/admin_home.jspx";
    public static final String DASHBOARD_PAGE = "/Admin/dashboard.jsp";

    // Purchase History URLs
    public static final String PURCHASE_HISTORY = "/Admin/PurchaseHistory";
    public static final String PURCHASE_HISTORY_SERVLET = "jets.projects.admin_user.purchaseHistory.PurchaseHistoryServlet";
    public static final String PURCHASE_HISTORY_PAGE = "/purchase-history.jsp";

    public static final String PURCHASE_HISTORY_API = "/Admin/PurchaseHistory/api";
    public static final String PURCHASE_HISTORY_API_SERVLET = "PurchaseHistoryApiServlet";

    public static final String PURCHASE_HISTORY_RECEIPT_API = "/Admin/PurchaseHistory/api/*";
    public static final String PURCHASE_HISTORY_RECEIPT_SERVLET = "jets.projects.admin_user.purchaseHistory.ReceiptDetailsApiServlet";


}