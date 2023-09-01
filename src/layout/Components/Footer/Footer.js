import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import FooterTop from "./FooterTop";
import FooterBottom from "./FooterBottom";
const cx = classNames.bind(styles);


function Footer() {
    return ( 
        <div className={cx("footer")}>
            <FooterTop />
            <FooterBottom />
        </div>
     );
}

export default Footer;