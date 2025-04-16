class ServerURLMapper {
    // Books Section.
    static userGetTopSellingBooksList = '/userGetTopSellingBooksList';
    static userGetTopSellingBookFromEachGenreList = '/userGetTopSellingBookFromEachGenreList';
    static userGetAllBooksList = '/userGetAllBooksList';
    static userSearchBooks = '/userSearchBooks';
    static userGetBookDetails = '/userGetBookDetails';

    // Cart Section.
    static userGetCart = '/userGetCart';
    static userValidateCart = '/userValidateCart';
    static userGetCartShippingFee = '/userGetCartShippingFee';
    static userAddItemToCart = '/userAddItemToCart';
    static userUpdateCartItemQuantity = '/userUpdateCartItemQuantity';
    static userRemoveCartItem = '/userRemoveCartItem';
    static userTruncateCart = '/userTruncateCart';

    // Orders Section.
    static userGetAllOrdersList = '/userGetAllOrdersList';
    static userGetOrderDetails = '/userGetOrderDetails';
    static userCheckoutUsingAccountBalance = '/userCheckoutUsingAccountBalance';
    static userCheckoutUsingCreditCard = '/userCheckoutUsingCreditCard';

    // User Account Section.
    static userLogin = '/userLogin';
    static userRegister = '/userRegister';
    static userGetProfile = '/userGetProfile';
    static userUpdateEmail = '/userUpdateEmail';
    static userUpdatePassword = '/userUpdatePassword';
    static userUpdatePersonalDetails = '/userUpdatePersonalDetails';
    static userRechargeAccountBalanceUsingCreditCard = '/userRechargeAccountBalanceUsingCreditCard';

    // Wish List Section.
    static userGetAllWishList = '/userGetAllWishList';
    static userGetAllWishListBooks = '/userGetAllWishListBooks';
    static userAddWishListItem = '/userAddWishListItem';
    static userRemoveFromWishList = '/userRemoveFromWishList';

    // Purchase History Section.
    static userGetAllPurchaseHistoryList = '/userGetAllPurchaseHistoryList';
    static userGetPurchaseHistoryItemDetails = '/userGetPurchaseHistoryItemDetails';
}

export default ServerURLMapper;