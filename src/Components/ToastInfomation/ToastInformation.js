import classNames from 'classnames/bind';
import style from './ToastInformation.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleExclamation, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

const cx = classNames.bind(style);

function ToastInformation({content, title, bool, setBool, timeOut = 3000}) {

    const [typeIcon, setTypeIcon] = useState(faCircleCheck)

    useEffect(()=> {
        switch(content)
        {
            case "Success": 
            {
                setTypeIcon(faCircleCheck);
                break;
            }
            case "Error": 
            {
                setTypeIcon(faCircleExclamation);
                break;
            }
            case "Warn": 
            {
                setTypeIcon(faTriangleExclamation);
                break;
            }
            default: 
                setTypeIcon(faCircleExclamation);
        }
    }, [])

    const handleOnClickExit = (e) => {
        setBool(false)
    }

    const handleOnClickInfor = (e) => {
        e.preventDefault();
    }

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            setBool(false);
        }, timeOut);
    
        return () => {
          // 👇️ clear timeout when the component unmounts
          clearTimeout(timeoutID);
        };
      }, [bool]);

    return ( 
        <div className={cx("main")} onClick={handleOnClickInfor}>
            <div className={cx("toast", `toast__${content}`)} >
                <div className={cx(`toast__${content}__icon`)}>
                    <FontAwesomeIcon icon={typeIcon}/>
                </div>
                <div className={cx("toast__content")}>{title}</div>
                <div className={cx("toast__noti")} onClick={handleOnClickExit}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
        </div>
     );
}

export default ToastInformation;