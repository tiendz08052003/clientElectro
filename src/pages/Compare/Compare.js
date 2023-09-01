import classNames from "classnames/bind";
import styles from "./Compare.module.scss";
import * as CompareServices from "~/services/CompareServices"
import { useState } from "react";
import { useEffect } from "react";
import CompareChild from "./CompareChild";

const cx = classNames.bind(styles);

function Compare() {
    const [compare, setCompare] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await CompareServices.getCompare();
            setCompare(res);
        }
        fetchAPI();
    }, [reload])

    return ( 
        <div className={cx("compare")}>
            <div className={cx("compare__topic")}>
                compare
            </div>
            <table className={cx("compare__table")}>
                <thead>
                    <tr className={cx("compare__tableRow1")}>
                        <th className={cx("compare__tableRow1__column1")}></th>
                        <th className={cx("compare__tableRow1__column2")}></th>
                        <th className={cx("compare__tableRow1__column3")}>Product</th>
                        <th className={cx("compare__tableRow1__column4")}>Price</th>
                        <th className={cx("compare__tableRow1__column5")}>Discount</th>
                    </tr>
                </thead>
                <tbody>
                    {compare.length > 0 ? (compare.map((compareChild, index) => (
                        <CompareChild key={compareChild._id} compareChild={compareChild} setReload={setReload} reload={reload}/> 
                    ))) : (
                        <tr>
                            <td className={cx("compare__table--noData")} colSpan="5">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
     );
}

export default Compare;