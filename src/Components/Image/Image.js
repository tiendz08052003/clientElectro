import { forwardRef, useState } from "react";
import { imgs } from "~/assest/imgs";
import classNames from "classnames";
import styles from "./Image.module.scss"

const Image = forwardRef(({src, alt, className, fallbackImage = imgs.noImage, ...props}, ref) => {
    const [fallback, setFallBack] = useState('')
    const handleOnError = () => {
        setFallBack(fallbackImage);
    }
    return ( 
        <img src={fallback || src} className={classNames(styles.image, className)} alt={alt}  ref={ref} {...props} onError={handleOnError}/>    
    )
})

export default Image;