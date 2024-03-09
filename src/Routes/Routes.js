import { DefaultLayout, HeaderAndFooterOnly } from "~/layout";
import Account from "~/pages/Account";
import Cart from "~/pages/Cart";
import Home from "~/pages/Home";
import Wishlist from "~/pages/Wishlist";
import Compare from "~/pages/Compare";
import ProductDetails from "~/pages/ProductDetails";
import AccountForget from "~/pages/AccountForget/AccountForget";
import config from "~/config/config";

const publicRoute = [
    { path: config.routes.home, component: Home, layout: DefaultLayout,name: "Home" },
    { path: config.routes.productDetails, component: ProductDetails, layout: DefaultLayout,name: "ProductDetails"},
    { path: config.routes.cart, component: Cart, layout: HeaderAndFooterOnly, name: "Cart"},
    { path: config.routes.wishlist, component: Wishlist, layout: HeaderAndFooterOnly, name: "Wishlist"},
    { path: config.routes.compare, component: Compare, layout: HeaderAndFooterOnly, name: "Compare"},
    { path: config.routes.account, component: Account, layout: null, name: "Account"},
    { path: config.routes.accountForget, component: AccountForget, layout: null, name: "AccountForget"},
]

const privateRoute = [
    
]

export { privateRoute, publicRoute}