import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa0, faChevronCircleDown, faMagnifyingGlass, faMessage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { IconCart, IconCollapseRightChat, IconCollapseLeftChat, IconFace, IconHideChat, IconImage, IconPrint, IconVideo } from "~/Components/Icons";
import Image from "~/Components/Image";
import { getUser } from "~/redux/selector";
import { useSelector } from "react-redux";
import { socket } from "~/socket";

import * as AccountServices from '~/services/AccountServices'; 
import * as ChatServices from "~/services/ChatServices";
import ChatGuest from "./ChatGuest";
import Loading from "~/Components/Loading";
import Message from "./Message/Message";

const cx = classNames.bind(styles);

function Chat() {
    const [view, setView] = useState(false);
    const [styleFil, setStyleFil] = useState(false);
    const [idRoom, setIdRoom] = useState("");
    const [idGuest, setIdGuest] = useState("");
    const [boolChatting, setBoolChatting] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [nameGuest, setNameGuest] = useState("");
    const [styleSend, setStyleSend] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [messageSummary, setMessageSummary] = useState("");
    const [fresh, setFresh] = useState(false);
    const [listMessageChat, setListMessageChat] = useState([]);
    const [showSidebar, setShowSidebar] = useState(1);
    const [valueInput, setValueInput] = useState("");
    const [collapse, setCollapse] = useState(true);
    const ref = useRef(null);
    const refMainMessage = useRef(null);
    socket.connect();

    const User = useSelector(getUser);

    const handleClickButtonChat = () => {
        setView(!view);
        if (User) 
        {
            setFresh(true)
            if(!fresh)
            {
                setBoolChatting(true);
                const fetchAPI = async () => {
                    const res = await ChatServices.getChat();
                    socket.emit('client-to-sever', {res, User});
                }   
                fetchAPI();
            } 
        }
    }

    const handleClickButtonCloseChat = () => {
        setView(!view);
        setFresh(false)
        if(nameGuest === "")
        {
            console.log(1);
            socket.emit("client-send-server-disconnect")
        }
    }

    useEffect(() => {
        const fetchAPI = async () => {
            const results = await AccountServices.getAccount();
            setUsers(results);
        }
        fetchAPI();
    }, [])

    const styleChat = {
        width: view ? "auto" : "100px",
        height: view ? "auto" : "48px",
    }

    const styleFilter = {
        display: styleFil ? "none" : "block",
    }

    const handleFocusInput = () => {
        setStyleFil(true);
    }

    const handleBlurInput = () => {
        setStyleFil(false);
    }

    const handleClickChatClient = () => {
        socket.emit("client-to-server-joinRoom", idRoom);
        setIdGuest(idRoom[0]);
        setBoolChatting(true);
        setMessageSummary("");
    }

    useEffect(() => {
        socket.on("server-send-client-reply", (obj) => {
            console.log("Có người kết nối vào phòng: ", obj.id)
            const fetchAPI = async () => {
                const res = await ChatServices.getChat()
                const user = res.find(x => x.idAuth === User._id)
                await ChatServices.updateChat(user._id, {
                    idRoom: obj.idRoom,
                    queue: false,
                })
                const results = await AccountServices.getAccount();
                results.map(ur => {
                    if((User.admin &&  obj.idRoom === ur._id) || (!User.admin && obj.idAdmin === ur._id))
                    {
                        setNameGuest(ur.name)
                    }
                })
            }
            fetchAPI();
        })

        socket.on("server-send-client-dsUserName", (array) => {
            setListUser(array)
        })

        socket.on("server-send-client-reload", (array) => {
            console.log("Có người đăng xuất khỏi phòng")
            setListUser(array)
        })

        socket.on("server-send-client-message", (data) => {
            setMessageSummary(data.messageInput)
            const x = refMainMessage.current;
            if(data.User._id === User._id)
                x.insertAdjacentHTML("beforeend", `
                    <div style="display: flex;
                        justify-content: end;
                        padding: 2px 10px;
                        word-wrap: break-word;">
                        <span style="
                            background-color: #0084ff;
                            max-width: 60%;
                            word-wrap: break-word;
                            padding: 10px 15px;
                            border-radius: 15px;
                            overflow: hidden;"
                        >${data.messageInput}</span>
                    </div>
                `);
            else
                x.insertAdjacentHTML("beforeend", `
                    <div style="display: flex;
                        padding: 2px 10px;
                        word-wrap: break-word;">
                        <span style="
                            max-width: 60%;
                            word-wrap: break-word;
                            background-color: #ddd;
                            padding: 10px 15px;
                            border-radius: 15px;
                            overflow: hidden;"
                        >${data.messageInput}</span>
                    </div>
                `);
                    
        })

        socket.on("server-send-client-finishChat", () => {
            const fetchAPI = async () => {
                const res = await ChatServices.getChat()
                const user = res.find(x => x.idAuth === User._id)
                await ChatServices.updateChat(user._id, {
                    idRoom: user.idAuth,
                    message: [],
                })
                if(User.admin)
                    socket.emit("client-send-server-setIdRoom")
            }
            fetchAPI();
            setNameGuest("")
            setIdGuest("")
            const x = refMainMessage.current;
            if(x)
            {
                x.innerHTML = "";
            }
            console.log("Đã kết thúc cuộc trò chuyện!")
        })

        socket.on("server-send-client-connectSuccess", (id) => {
            console.log("Kết nối thành công: ", id)
        })

        socket.on("server-send-client-connected", (id) => {
            console.log("Đã kết nối: ", id)
        })

        socket.on("server-send-client-loadAgain", () => {
            const fetchAPI = async () => {
                const res = await ChatServices.getChat()                 
                const results = await AccountServices.getAccount();
                const user = res.find(x => x.idAuth === User._id)
                const guestChat = res.find(x => (x.idRoom === user.idRoom && user.idAuth !== x.idAuth));
                const guest = results.find(x => x._id === guestChat.idAuth)
                setNameGuest(guest.name)
                setIdGuest(guest._id)
                setListMessageChat(guestChat.message)
            }
            fetchAPI();
        })

        socket.on("server-send-client-disConnect", () => {
            setNameGuest("")
            setIdGuest("")
            setListMessageChat([])
        })

        return () => {
          socket.off("server-send-client-reply");
          socket.off("server-send-client-dsUserName");
          socket.off("server-send-client-connectSuccess");
          socket.off("server-send-client-connected");
          socket.off("server-send-client-reload");
          socket.off("server-send-client-finishChat");
          socket.off("server-send-client-message");
          socket.off("server-send-client-disConnect");
        };
    }, []);
    
    const handleOnInputText = (e) => {
        setMessageInput(e.target.value)
        if(e.target.value.length !== 0 && nameGuest !== "")
            setStyleSend(true);
        else
            setStyleSend(false);
    }

    const handleOnClickSend = () => {
        socket.emit("client-to-server-message", {messageInput, User})
        setMessageInput("");
        setStyleSend(false);
        ref.current.focus();
    }

    const handleOnClickChatting = () => {
        setBoolChatting(true)
        users.map((ur) => {
            if(idGuest === ur._id){
                setNameGuest(ur.name)
            }
        })
    }

    const handleOnClickFinishChat = () => {
        const id = User._id;
        // send to sever id guest
        socket.emit("client-to-server-finnishChat", User.admin? idGuest : id)
    }

    const handleClickOption = (e) => {
        setShowSidebar(e.target.value)
    }

    const handleInput = (e) => {
        setValueInput(e.target.value)
        setListUser(listUser.filter(x => {
            let k = users.filter(user => user._id === x)
            let h = k.map(x => x.name)[0]
            let y = h.toLowerCase();
            let z = e.target.value.toLowerCase();
            if(y.includes(z))
            {
                return x;
            }
        }))
    }

    const handleClickCollapse = () => {
        setCollapse(!collapse)
    }

    return ( 
        <div className={cx("chat")} style={styleChat}>
            <div className={cx("chat__main")} style={{display: view ? "block": "none"}}>
            
                <div className={cx("chat__main__top")}>
                    <div className={cx("chat__main__top__title")}>
                        Chat •
                        {
                            collapse && (
                                <span className={cx("chat__main__top__title__name")}>
                                    {User && User.name}
                                </span>
                            )
                        }
                    </div>
                    <div className={cx("chat__main__top__icon")}>
                        {
                            User && User.admin && (
                                collapse ? (
                                    <div className={cx("chat__main__top__icon__cut")} onClick={handleClickCollapse}>
                                        <IconCollapseRightChat className={cx("chat__main__top__icon__cut__details")}/>
                                    </div>
                                ) : (
                                    <div className={cx("chat__main__top__icon__cut")} onClick={handleClickCollapse}>
                                        <IconCollapseLeftChat className={cx("chat__main__top__icon__cut__details")}/>
                                    </div>
                                )
                            ) 
                        }
                        <div className={cx("chat__main__top__icon__hide")} onClick={handleClickButtonCloseChat}>
                            <IconHideChat className={cx("chat__main__top__icon__hide__details")} />
                        </div>
                    </div>
                </div>
            {
                User ? (
                        <div className={cx("chat__main__bottom")}>
                            {User && User.admin && (
                                <div className={cx("chat__main__bottom__account")}>
                                    <div className={cx("chat__main__bottom__account__search")}>
                                        <div className={cx("chat__main__bottom__account__search__txtSearch")}>
                                            <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("chat__main__bottom__account__search__txtSearch__icon")} />
                                            <input value={valueInput} type="text" className={cx("chat__main__bottom__account__search__txtSearch__input")} onFocus={handleFocusInput} onBlur={handleBlurInput} onInput={handleInput}/>
                                        </div>
                                        <div className={cx("chat__main__bottom__account__search__filter")} style={styleFilter}>
                                            <select className={cx("chat__main__bottom__account__search__filter__select")} onClick={handleClickOption}>
                                                <option value={1}>
                                                    Tất cả
                                                </option>
                                                <option value={2}>
                                                    Đang chat
                                                </option>
                                                <option value={3}>
                                                    Khách hàng đợi
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    {idGuest && (showSidebar == 1 || showSidebar == 2) && (
                                        users.map((ur) => (
                                            idGuest === ur._id && ur.admin === false && (
                                                <div className={cx("chat__main__bottom__account__details")} key={ur._id} onClick={handleOnClickChatting}>
                                                    <div className={cx("chat__main__bottom__account__details__avatar")}>
                                                        <Image src="https://cf.shopee.vn/file/792b99e3c472e88995b2e55d341f670e_tn" className={cx("chat__main__bottom__account__details__avatar__details")}/>
                                                    </div>
                                                    <div className={cx("chat__main__bottom__account__details__content")}>
                                                        <div className={cx("chat__main__bottom__account__details__content__name")}>
                                                            {ur.name}
                                                        </div>
                                                        <div className={cx("chat__main__bottom__account__details__content__summary")}>
                                                            {messageSummary}
                                                        </div>
                                                    </div>
                                                </div>      
                                            )
                                        ))
                                    )}
                                    {
                                        (showSidebar == 1 || showSidebar == 3) && (
                                            <div className={cx("chat__main__bottom__account__listQueue")}>
                                                <div className={cx("chat__main__bottom__account__listQueue__title")}>Khách hàng đang đợi: {listUser.length}</div>
                                                <ul className={cx("chat__main__bottom__account__listQueue__list")}>
                                                    {
                                                        listUser.map((id) => (
                                                            users.map((ur) => (
                                                                id === ur._id && ur.admin === false && (
                                                                    <ChatGuest key={id} User={User} ur={ur} setNameGuest={setNameGuest} setBoolChatting={setBoolChatting} setIdRoom={setIdRoom}/>
                                                                )
                                                            ))
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                            {collapse && (
                                nameGuest !== "" || (User && User.admin === false) ? (
                                    <div className={cx("chat__main__bottom__content")}>
                                        <div className={cx("chat__main__bottom__content__option")}>
                                            {nameGuest === "" ? (
                                                <>
                                                    <Loading />
                                                    <span className={cx("chat__main__bottom__content__option__topic")}>
                                                        Đang đợi nhân viên hỗ trợ
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={cx("chat__main__bottom__content__option__name")}>
                                                        {nameGuest}
                                                    </div>
                                                    <FontAwesomeIcon icon={faChevronCircleDown}/>
                                                    {boolChatting && (<div className={cx("chat__main__bottom__content__option__finish")} onClick={handleOnClickFinishChat}>Kết thúc</div>)}
                                                </>
                                            ) }
                                        </div>
                                        <div ref={refMainMessage} style={{display: boolChatting || (User && User.admin === false) ? "block" : "none"}} className={cx("chat__main__bottom__content__main")} >
                                        {
                                            listMessageChat.length !== 0 && (
                                                listMessageChat.map((x, index) => (
                                                    x.admin ? (
                                                        User.admin ? (
                                                            <Message key={index} message={x.admin} style={{"justifyContent": "right"}} right={true}/>
                                                        ) : (
                                                            <Message key={index} message={x.admin} style={{"justifyContent": "left"}} right={false}/>
                                                        )
                                                    ) : (
                                                        !User.admin ? (
                                                            <Message key={index} message={x.user} style={{"justifyContent": "right"}} right={true}/>
                                                        ) : (
                                                            <Message key={index} message={x.user} style={{"justifyContent": "left"}} right={false}/>
                                                        )
                                                    )
                                                ))
                                            ) 
                                        }
                                        </div>
                                        {
                                            boolChatting === true  || User.admin === false ? (
                                                <div className={cx("chat__main__bottom__content__input")}>
                                                    <div className={cx("chat__main__bottom__content__input__import")}>
                                                        <textarea type="text" placeholder="Nhập nội dung tin nhắn" className={cx("chat__main__bottom__content__input__import__text")} ref={ref} value={messageInput} onInput={handleOnInputText}></textarea>
                                                        {
                                                            styleSend && (
                                                                <div className={cx("chat__main__bottom__content__input__import__send")} onClick={handleOnClickSend}>
                                                                    <FontAwesomeIcon icon={faPaperPlane} className={cx("chat__main__bottom__content__input__import__send__icon")}/>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <div className={cx("chat__main__bottom__content__input__option")}>
                                                        <IconFace className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconFace")}/>
                                                        <IconImage className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconImage")}/>
                                                        <IconVideo className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconVideo")}/>
                                                        <IconCart className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconCart")}/>
                                                        <IconPrint className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconPrint")}/>
                                                    </div>
                                                </div>

                                            ) : (
                                                <div className={cx("chat__main__bottom__content__button")}>
                                                    <button className={cx("chat__main__bottom__content__button__details")} onClick={handleClickChatClient}>
                                                        Tư vấn khách hàng
                                                    </button>
                                                </div>
                                            ) 
                                        }
                                    </div>
                                ) : (
                                    <div className={cx("chat__main__bottom__content")}>
                                        <div className={cx("chat__main__bottom__content__empty")}>
                                            Chưa có đoạn chat nào
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                ) : (
                    <div className={cx("chat__main__register")}>
                        <div className={cx("chat__main__register__content")}>
                            Hãy <a href="./account?type=register">đăng ký</a> hoặc <a href="./account?type=login">đăng nhập</a> tài khoản 
                        </div>
                    </div>
                )
            }
                
            </div>
            <div className={cx("chat__button")} onClick={handleClickButtonChat} style={{display: view === false ? "flex" : "none"}}>
                <div className={cx("chat__button__icon")}>
                    <FontAwesomeIcon icon={faMessage} />
                </div>
                <div className={cx("chat__button__content")}>
                    Chat
                </div>
            </div>
        </div> 
    );
}

export default Chat;