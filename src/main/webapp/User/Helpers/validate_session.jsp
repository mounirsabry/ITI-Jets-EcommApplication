<c:if test="${empty sessionScope.userID}">
    <c:redirect 
    url="user_login.jspx?errorMessage=Not Logged In or Session Timed Out!"
    />
</c:if>