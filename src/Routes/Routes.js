import { HeaderAndFooterOnly } from "~/layout";
import Account from "~/pages/Account";
import Cart from "~/pages/Cart";
import Home from "~/pages/Home";
import Wishlist from "~/pages/Wishlist";
import Compare from "~/pages/Compare";
import ProductDetails from "~/pages/ProductDetails";
import AccountForget from "~/pages/AccountForget/AccountForget";
import config from "~/config/config";

const publicRoute = [
    { path: config.routes.home, component: Home },
    { path: config.routes.productDetails, component: ProductDetails},
    { path: config.routes.cart, component: Cart, layout: HeaderAndFooterOnly},
    { path: config.routes.wishlist, component: Wishlist, layout: HeaderAndFooterOnly},
    { path: config.routes.compare, component: Compare, layout: HeaderAndFooterOnly},
    { path: config.routes.account, component: Account, layout: null},
    { path: config.routes.accountForget, component: AccountForget, layout: null},
]

const privateRoute = [
    
]

export { privateRoute, publicRoute}