interface IMessageable {
    messageBinds: { [msg: string]: Function };

    bindMessage(msg: string, func: Function);
    sendMessage(msg: string, param: any);
} 