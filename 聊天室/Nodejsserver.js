var net = require('net')

let clients = []

//时间函数
function time(){
    let date=new Date();
    let h=date.getHours();
    if(h<10) h='0'+h;
    let m=date.getMinutes();
    if(m<10) m='0'+m;
    let s=date.getSeconds();
    if(s<10) s='0'+s;
    let t=h+':'+m+':'+s;
    return t;
}
var server = net.createServer( (sock)=> {
    let client=[];
    let name;
    sock.on('data', function(data) {
        //接收数据
        let message = data.toString();
        //接收用户昵称，通知群人员，该人员上线
        if(message.startsWith('username')){
            name=message.slice(9);
            client.push(sock);
            client.push(name);
            clients.push(client);
            clients.map((client)=>{
                client[0].write(time() +name+'上线');
            });
            console.log("当前在线人数:" + clients.length )
        }  
        //＠私聊(格式：@+昵称+空格+聊天内容)
        if(message.startsWith('@')){
            let othername=message.slice(1).split(' ')[0];
            console.log(othername);
            let realmessage=message.slice(1).split(' ')[1];
            console.log(realmessage);
            clients.map((client)=>{
                if(othername==client[client.length-1]){
                    client[0].write(time()+' '+name+':');
                    client[0].write(realmessage);
                }
            });
        }
        //发送普通信息
        if((message.startsWith('@')==false)&&(message.startsWith('username')==false)){
            clients.map((client)=>{
                if(name!=client[client.length-1]){
                    client[0].write(time()+' '+name+':');
                    client[0].write(message);
                }
            })
        }
    })
})
//服务器端口号和IP地址
let port = 8210
server.listen(port, '127.0.0.1')

console.log("listen on port: " + port )

