import classNames from "classnames/bind";
import styles from "./Wishlist.module.scss";
import * as WishlistServices from "~/services/WishlistServices"
import { useState } from "react";
import { useEffect } from "react";
import WishlistChild from "./WishlistChild/WishlistChild";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "~/redux/selector";
import {CreateAxios} from "~/Components/CreateInstance/CreateInstance";
import { loginAccount } from "../Account/accountSlice";

const cx = classNames.bind(styles);

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [reload, setReload] = useState(false);

    const user = useSelector(getUser);
    const dispatch = useDispatch();

    const axiosJWT = CreateAxios(user, dispatch, loginAccount)

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await WishlistServices.getWishlist();
            setWishlist(res);
        }
        fetchAPI();
    }, [reload])

    return ( 
        <div className={cx("wishlist")}>
            <div className={cx("wishlist__topic")}>
                wishlist
            </div>
            <table className={cx("wishlist__table")}>
                <thead>
                    <tr className={cx("wishlist__tableRow1")}>
                        <th className={cx("wishlist__tableRow1__column1")}></th>
                        <th className={cx("wishlist__tableRow1__column2")}></th>
                        <th className={cx("wishlist__tableRow1__column3")}>Product</th>
                        <th className={cx("wishlist__tableRow1__column4")}>Price</th>
                        <th className={cx("wishlist__tableRow1__column5")}>Discount</th>
                    </tr>
                </thead>
                <tbody>
                {user?.accessToken ? (
                    wishlist.length > 0 ? (wishlist.map((wishlistChild, index) => (
                        <WishlistChild key={wishlistChild._id} resultWishlist={wishlistChild} setReload={setReload} reload={reload}/> 
                    ))) : (
                        <tr>
                            <td className={cx("wishlist__table--noData")} colSpan="5">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )
                ) :(
                    <tr>
                        <td className={cx("wishlist__table--noData")} colSpan="7">
                            Hãy <a href="./account?type=register">đăng ký</a> hoặc <a href="./account?type=login">đăng nhập</a> tài khoản để có thể xem danh sách yêu thích
                        </td>
                    </tr>
                )}
                    
                </tbody>
            </table>
        </div>
     );
}

export default Wishlist;