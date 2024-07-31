import classNames from "classnames/bind";
import styles from "./Cart.module.scss";

import { IconLink, IconNext } from "~/Components/Icons";
import CartChild from "./CartChild";
import { useEffect, useState } from "react";
import * as CartServices from '~/services/CartServices';
import * as ProductServices from '~/services/ProductServices';
import * as MainServices from '~/services/MainServices';
import { useSelector } from "react-redux";
import { getUser } from "~/redux/selector";

const cx = classNames.bind(styles);

function Cart({reloadCart, setReloadCart}) {
    const [listResultCart, setListResultCart] = useState([])
    const [reload, setReload] = useState(true);
    const [shipper, setShipper] = useState(500);
    const [subtotal, setSubtotal] = useState(0);

    const user = useSelector(getUser);

    useEffect(() => {
        if (user?.accessToken)
        {
            const fetchAPI = async () => {
                const res1 = await ProductServices.shop();
                const res2 = await CartServices.getCart();
                let sum = 0;
                res2.map(childCart => {
                    if(childCart.idAccount === user._id)
                    {
                        res1.map(childProduct => {
                            if(childCart.idProduct === childProduct._id)
                            {
                                sum += childProduct.price * childCart.count - childProduct.discount * childCart.count;
                            }
                        })
                    }
                })
                setSubtotal(sum);
                setListResultCart(res2.filter(x => x.idAccount === user._id));
                setReloadCart(!reloadCart);
            }
            fetchAPI();
        }
        else {
            (async () => {
                const { id } = await MainServices.getIDHardware();
                const res1 = await ProductServices.shop();
                const data = await CartServices.getCartNoLogin(id);
                const res2 = data.data;
                let sum = 0;
                res2.map(childCart => {
                    res1.map(childProduct => {
                        if(childCart.idProduct === childProduct._id)
                        {
                            sum += childProduct.price * childCart.count - childProduct.discount * childCart.count;
                        }
                    })
                })
                setSubtotal(sum);
                setListResultCart(res2);
                setReloadCart(!reloadCart);
            })();
        }
    }, [reload])


    return ( 
        <div className={cx("cart")}>
            <div className={cx("cart__topic")}>
                Cart
            </div>
            <table className={cx("cart__table")}>
                <thead>
                    <tr className={cx("cart__tableRow1")}>
                        <th className={cx("cart__tableRow1__column1")}></th>
                        <th className={cx("cart__tableRow1__column2")}></th>
                        <th className={cx("cart__tableRow1__column3")}>Product</th>
                        <th className={cx("cart__tableRow1__column4")}>Price</th>
                        <th className={cx("cart__tableRow1__column5")}>Discount</th>
                        <th className={cx("cart__tableRow1__column6")}>Quantity</th>
                        <th className={cx("cart__tableRow1__column7")}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listResultCart.length > 0 ? (
                            <>
                                {
                                    listResultCart.map((resultCart, index) => (
                                        <CartChild key={index} resultCart={resultCart} setReload={setReload} reload={reload}/>
                                    ))
                                }
                                <tr className={cx("cart__tableRow3")}>
                                    <td className={cx("cart__tableRow3__column1")} colSpan="6">
                                        <div className={cx("cart__tableRow3__column1__child")}>
                                            <div className={cx("cart__tableRow3__column1__child__left")}>
                                                <div className={cx("cart__tableRow3__column1__child__left__input")}>
                                                    <input type="text" name="" id="" className={cx("cart__tableRow3__column1__child__left__input__child")} placeholder="Coupon code" />
                                                    <button className={cx("cart__tableRow3__column1__child__left__input__content")}>Apply coupon</button>
                                                </div>
                                            </div>
                                            <div className={cx("cart__tableRow3__column1__child__right")}>
                                                <div className={cx("cart__tableRow3__column1__child__right__pay")}>
                                                    <a href="./" className={cx("cart__tableRow3__column1__child__right__pay__link--link")}>
                                                        <div className={cx("cart__tableRow3__column1__child__right__pay__link")}>
                                                            pay with
                                                            <IconLink className={cx("cart__tableRow3__column1__child__right__pay__link__letter")}/>
                                                            <IconNext className={cx("cart__tableRow3__column1__child__right__pay__link__arrow")}/>
                                                        </div>
                                                    </a>
                                                    <div className={cx("cart__tableRow3__column1__child__right__pay__or")}>
                                                        <i className={cx("fa-solid fa-minus cart__tableRow3__column1__child__right__pay__or--icon")}></i>
                                                        <span className={cx("cart__tableRow3__column1__child__right__pay__or--content")}>OR</span>
                                                        <i className={cx("fa-solid fa-minus cart__tableRow3__column1__child__right__pay__or--icon")}></i>
                                                    </div>
                                                    <a href="./" className={cx("cart__tableRow3__column1__child__right__pay__add--link")}>
                                                        <div className={cx("cart__tableRow3__column1__child__right__pay__add")}>
                                                            <strong>Proceed to checkout</strong>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr> 
                                <tr className={cx("cart__tableRow4")}>
                                    <td className={cx("cart__tableRow4__column1")} colSpan="6">
                                        <div className={cx("cart__tableRow4__column1__total")}>
                                            <div className={cx("cart__tableRow4__column1__total__table")}>
                                                <div className={cx("cart__tableRow4__column1__total__table--name")}>
                                                    <span className={cx("cart__tableRow4__column1__total__table--name--child")}>Cart totals</span>
                                                </div>
                                                <div className={cx("cart__tableRow4__column1__total__table--sub")}>
                                                    <div className={cx("cart__tableRow4__column1__total__table--sub--left")}>
                                                        <strong>Subtotal</strong>
                                                    </div>
                                                    <div className={cx("cart__tableRow4__column1__total__table--sub--right")}>
                                                        {subtotal}
                                                    </div>
                                                </div>
                                                <div className={cx("cart__tableRow4__column1__total__table--shipping")}>
                                                    <strong>Shipping</strong>
                                                </div>
                                                <div className={cx("cart__tableRow4__column1__total__table--flat")}>
                                                    <div className={cx("cart__tableRow4__column1__total__table--flat--left")}>
                                                        Flat rate:
                                                    </div>
                                                    <div className={cx("cart__tableRow4__column1__total__table--flat--right")}>
                                                        {shipper}
                                                    </div>
                                                </div>
                                                <div className={cx("cart__tableRow4__column1__total__table--ca")}>                                                
                                                    Shipping to <strong>CA.</strong>
                                                </div>
                                                <div className={cx("cart__tableRow4__column1__total__table--address")}>
                                                    <strong>Change address</strong>
                                                </div>
                                                <div className={cx("cart__tableRow4__column1__total__table--total")}>
                                                    <div className={cx("cart__tableRow4__column1__total__table--total--left")}><strong>Total</strong></div>
                                                    <div className={cx("cart__tableRow4__column1__total__table--total--right")}><strong>{subtotal + shipper}</strong></div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="./" className={cx("cart__tableRow4__column1__pay--link")}>
                                            <div className={cx("cart__tableRow4__column1__pay")}>
                                                <strong>Proceed to checkout</strong>
                                            </div>
                                        </a>
                                    </td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td className={cx("cart__table--noData")} colSpan="7">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
     );
}
export default Cart;